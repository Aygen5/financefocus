using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using FinanceFocus.Application.AI.Intent;
using FinanceFocus.Application.AI.Options;
using FinanceFocus.Application.AI.Prompts;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;
using FinanceFocus.Application.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace FinanceFocus.Application.Services.Providers;

public class OllamaUnavailableException : Exception
{
    public OllamaUnavailableException(string message, Exception? innerException = null)
        : base(message, innerException) { }
}

public class OllamaAIProvider : IAIProvider
{
    private readonly HttpClient _httpClient;
    private readonly IAIPromptBuilder _promptBuilder;
    private readonly AIOptions _options;
    private readonly ILogger<OllamaAIProvider> _logger;

    public string ProviderName => $"Ollama ({_options.Model})";

    public OllamaAIProvider(
        HttpClient httpClient,
        IAIPromptBuilder promptBuilder,
        IOptions<AIOptions> options,
        ILogger<OllamaAIProvider> logger)
    {
        _httpClient = httpClient;
        _promptBuilder = promptBuilder;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<AIChatResponseDto> ProcessChatPromptAsync(
        string userId,
        string prompt,
        AIIntentType intent,
        IEnumerable<AIChatMessageDto>? history,
        FinancialCoreMetricsDto metrics)
    {
        var messages = _promptBuilder.BuildOllamaChatMessages(prompt, intent, history, metrics);
        var baseUrl = _options.OllamaUrl.TrimEnd('/');
        var requestUrl = $"{baseUrl}/api/chat";
        var resolvedModel = await ResolveModelNameAsync(baseUrl);

        var payload = new
        {
            model = resolvedModel,
            messages = messages,
            stream = false,
            options = new
            {
                temperature = 0.0,
                top_p = 0.1,
                top_k = 20,
                repeat_penalty = 1.2,
                num_predict = 350
            }
        };

        var jsonPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions { WriteIndented = true });
        _logger.LogInformation("[OllamaAIProvider /api/chat] REQUEST JSON:\n{Json}", jsonPayload);

        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(_options.TimeoutSeconds));
            var response = await _httpClient.PostAsync(requestUrl, content, cts.Token);
            var rawResponseBody = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("[OllamaAIProvider /api/chat] HTTP Status: {Status}", response.StatusCode);
            _logger.LogInformation("[OllamaAIProvider /api/chat] RAW RESPONSE:\n{Body}", rawResponseBody);

            if (!response.IsSuccessStatusCode)
            {
                throw new OllamaUnavailableException($"Ollama API HTTP {(int)response.StatusCode} {response.StatusCode} hatası döndürdü: {rawResponseBody}");
            }

            using var doc = JsonDocument.Parse(rawResponseBody);
            string answerText = string.Empty;

            if (doc.RootElement.TryGetProperty("message", out var msgElement) &&
                msgElement.TryGetProperty("content", out var contentElement))
            {
                answerText = contentElement.GetString() ?? string.Empty;
            }
            else if (doc.RootElement.TryGetProperty("response", out var respElement))
            {
                answerText = respElement.GetString() ?? string.Empty;
            }

            return new AIChatResponseDto
            {
                Answer = answerText.Trim(),
                Category = "Yerel LLM Finansal Danışmanlık",
                ProviderUsed = $"Ollama ({resolvedModel})",
                RespondedAt = DateTime.UtcNow
            };
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "[OllamaAIProvider] HTTP bağlantı hatası");
            throw new OllamaUnavailableException($"Yerel AI servisine ({baseUrl}) ulaşılamadı. Hata: {ex.Message}", ex);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "[OllamaAIProvider] Zaman aşımı hatası");
            throw new OllamaUnavailableException($"Yerel AI yanıt verme süresi ({_options.TimeoutSeconds} sn) zaman aşımına uğradı.", ex);
        }
    }

    public async IAsyncEnumerable<string> StreamChatPromptAsync(
        string userId,
        string prompt,
        AIIntentType intent,
        IEnumerable<AIChatMessageDto>? history,
        FinancialCoreMetricsDto metrics,
        [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var messages = _promptBuilder.BuildOllamaChatMessages(prompt, intent, history, metrics);
        var baseUrl = _options.OllamaUrl.TrimEnd('/');
        var requestUrl = $"{baseUrl}/api/chat";
        var resolvedModel = await ResolveModelNameAsync(baseUrl);

        var payload = new
        {
            model = resolvedModel,
            messages = messages,
            stream = true,
            options = new
            {
                temperature = 0.0,
                top_p = 0.1,
                top_k = 20,
                repeat_penalty = 1.2,
                num_predict = 350
            }
        };

        var jsonPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions { WriteIndented = true });
        _logger.LogInformation("[OllamaAIProvider Stream /api/chat] REQUEST JSON:\n{Json}", jsonPayload);

        var request = new HttpRequestMessage(HttpMethod.Post, requestUrl)
        {
            Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
        };

        HttpResponseMessage response;
        try
        {
            response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "[OllamaAIProvider Stream] HTTP bağlantı hatası");
            throw new OllamaUnavailableException($"Yerel AI servisine ({baseUrl}) ulaşılamadı. Hata: {ex.Message}", ex);
        }

        if (!response.IsSuccessStatusCode)
        {
            var rawError = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("[OllamaAIProvider Stream] Sunucu hatası HTTP {Status}: {Error}", response.StatusCode, rawError);
            throw new OllamaUnavailableException($"Ollama API HTTP {(int)response.StatusCode} {response.StatusCode} hatası döndürdü: {rawError}");
        }

        using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var reader = new StreamReader(stream, Encoding.UTF8);

        while (!cancellationToken.IsCancellationRequested)
        {
            var line = await reader.ReadLineAsync(cancellationToken);
            if (line == null) break;
            if (string.IsNullOrWhiteSpace(line)) continue;

            string? token = null;
            try
            {
                using var doc = JsonDocument.Parse(line);
                if (doc.RootElement.TryGetProperty("message", out var msgProp) &&
                    msgProp.TryGetProperty("content", out var contentProp))
                {
                    token = contentProp.GetString();
                }
                else if (doc.RootElement.TryGetProperty("response", out var respProp))
                {
                    token = respProp.GetString();
                }
            }
            catch
            {
                continue;
            }

            if (!string.IsNullOrEmpty(token))
            {
                yield return token;
            }
        }
    }

    private async Task<string> ResolveModelNameAsync(string baseUrl)
    {
        var configuredModel = _options.Model;
        try
        {
            var tagsUrl = $"{baseUrl}/api/tags";
            var tagsResponse = await _httpClient.GetAsync(tagsUrl);
            if (tagsResponse.IsSuccessStatusCode)
            {
                var tagsJson = await tagsResponse.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(tagsJson);
                if (doc.RootElement.TryGetProperty("models", out var modelsArr) && modelsArr.ValueKind == JsonValueKind.Array)
                {
                    var availableModels = modelsArr.EnumerateArray()
                        .Select(m => m.TryGetProperty("name", out var n) ? n.GetString() : null)
                        .Where(n => !string.IsNullOrEmpty(n))
                        .ToList();

                    if (availableModels.Contains(configuredModel, StringComparer.OrdinalIgnoreCase))
                    {
                        return configuredModel;
                    }

                    var exactOrBaseMatch = availableModels.FirstOrDefault(m =>
                        m!.StartsWith(configuredModel, StringComparison.OrdinalIgnoreCase) ||
                        configuredModel.StartsWith(m!, StringComparison.OrdinalIgnoreCase));

                    if (exactOrBaseMatch != null)
                    {
                        return exactOrBaseMatch;
                    }

                    if (availableModels.Any())
                    {
                        _logger.LogWarning("[OllamaAIProvider] Konfigüre edilen '{Configured}' bulunamadı, mevcut ilk model '{Found}' seçildi.", configuredModel, availableModels.First());
                        return availableModels.First()!;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[OllamaAIProvider] Model etiketleri alınırken uyarı, varsayılan konfigürasyon modeli kullanılacak.");
        }

        return configuredModel;
    }
}
