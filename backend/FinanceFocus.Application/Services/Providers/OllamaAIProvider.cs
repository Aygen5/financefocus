using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using FinanceFocus.Application.AI.Options;
using FinanceFocus.Application.AI.Prompts;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;
using FinanceFocus.Application.Interfaces;
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

    public string ProviderName => $"Ollama ({_options.Model})";

    public OllamaAIProvider(
        HttpClient httpClient,
        IAIPromptBuilder promptBuilder,
        IOptions<AIOptions> options)
    {
        _httpClient = httpClient;
        _promptBuilder = promptBuilder;
        _options = options.Value;
    }

    public async Task<AIChatResponseDto> ProcessChatPromptAsync(
        string userId,
        string prompt,
        IEnumerable<AIChatMessageDto>? history,
        FinancialCoreMetricsDto metrics)
    {
        var fullPrompt = _promptBuilder.BuildFullPrompt(prompt, history, metrics);
        var requestUrl = $"{_options.OllamaUrl.TrimEnd('/')}/api/generate";

        var payload = new
        {
            model = _options.Model,
            prompt = fullPrompt,
            stream = false
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(_options.TimeoutSeconds));
            var response = await _httpClient.PostAsync(requestUrl, content, cts.Token);

            if (!response.IsSuccessStatusCode)
            {
                throw new OllamaUnavailableException($"Ollama API sunucu hatası döndürdü: {response.StatusCode}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseJson);
            var answerText = doc.RootElement.TryGetProperty("response", out var respElement)
                ? respElement.GetString() ?? string.Empty
                : string.Empty;

            return new AIChatResponseDto
            {
                Answer = answerText,
                Category = "Yerel LLM Finansal Danışmanlık",
                ProviderUsed = ProviderName,
                RespondedAt = DateTime.UtcNow
            };
        }
        catch (HttpRequestException ex)
        {
            throw new OllamaUnavailableException("Yerel AI servisine (Ollama) ulaşılamadı. Lütfen http://localhost:11434 adresinde Ollama servisinin çalıştığından emin olun.", ex);
        }
        catch (TaskCanceledException ex)
        {
            throw new OllamaUnavailableException("Yerel AI yanıt verme süresi zaman aşımına uğradı.", ex);
        }
    }

    public async IAsyncEnumerable<string> StreamChatPromptAsync(
        string userId,
        string prompt,
        IEnumerable<AIChatMessageDto>? history,
        FinancialCoreMetricsDto metrics,
        [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var fullPrompt = _promptBuilder.BuildFullPrompt(prompt, history, metrics);
        var requestUrl = $"{_options.OllamaUrl.TrimEnd('/')}/api/generate";

        var payload = new
        {
            model = _options.Model,
            prompt = fullPrompt,
            stream = true
        };

        var json = JsonSerializer.Serialize(payload);
        var request = new HttpRequestMessage(HttpMethod.Post, requestUrl)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

        HttpResponseMessage response;
        try
        {
            response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            throw new OllamaUnavailableException("Yerel AI servisine (Ollama) ulaşılamadı. Lütfen http://localhost:11434 adresinde Ollama servisinin çalıştığından emin olun.", ex);
        }

        if (!response.IsSuccessStatusCode)
        {
            throw new OllamaUnavailableException($"Ollama API sunucu hatası döndürdü: {response.StatusCode}");
        }

        using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var reader = new StreamReader(stream, Encoding.UTF8);

        while (!reader.EndOfStream && !cancellationToken.IsCancellationRequested)
        {
            var line = await reader.ReadLineAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(line)) continue;

            string? token = null;
            try
            {
                using var doc = JsonDocument.Parse(line);
                if (doc.RootElement.TryGetProperty("response", out var respProp))
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
}
