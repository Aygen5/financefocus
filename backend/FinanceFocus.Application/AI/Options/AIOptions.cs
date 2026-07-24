namespace FinanceFocus.Application.AI.Options;

public class AIOptions
{
    public const string SectionName = "AISettings";

    public string Provider { get; set; } = "Ollama";
    public string OllamaUrl { get; set; } = "http://localhost:11434";
    public string Model { get; set; } = "qwen2.5";
    public int TimeoutSeconds { get; set; } = 60;
}
