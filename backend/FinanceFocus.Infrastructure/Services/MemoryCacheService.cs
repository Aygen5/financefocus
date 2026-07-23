using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FinanceFocus.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace FinanceFocus.Infrastructure.Services;

public class MemoryCacheService : ICacheService
{
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<MemoryCacheService> _logger;
    private static readonly ConcurrentDictionary<string, byte> _cacheKeys = new();

    public MemoryCacheService(IMemoryCache memoryCache, ILogger<MemoryCacheService> logger)
    {
        _memoryCache = memoryCache;
        _logger = logger;
    }

    public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        if (_memoryCache.TryGetValue(key, out T? value))
        {
            _logger.LogInformation("Cache HIT for Key: {CacheKey}", key);
            return Task.FromResult(value);
        }

        _logger.LogInformation("Cache MISS for Key: {CacheKey}", key);
        return Task.FromResult<T?>(default);
    }

    public Task SetAsync<T>(string key, T value, TimeSpan expiration, CancellationToken cancellationToken = default)
    {
        var options = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiration
        };

        options.RegisterPostEvictionCallback((evictedKey, _, _, _) =>
        {
            _cacheKeys.TryRemove(evictedKey.ToString()!, out _);
        });

        _memoryCache.Set(key, value, options);
        _cacheKeys.TryAdd(key, 0);

        _logger.LogInformation("Cache SET for Key: {CacheKey}, Expiration: {Expiration}", key, expiration);
        return Task.CompletedTask;
    }

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        _memoryCache.Remove(key);
        _cacheKeys.TryRemove(key, out _);

        _logger.LogInformation("Cache INVALIDATED for Key: {CacheKey}", key);
        return Task.CompletedTask;
    }

    public Task RemoveByPrefixAsync(string prefix, CancellationToken cancellationToken = default)
    {
        var matchingKeys = _cacheKeys.Keys.Where(k => k.Contains(prefix)).ToList();

        foreach (var key in matchingKeys)
        {
            _memoryCache.Remove(key);
            _cacheKeys.TryRemove(key, out _);
            _logger.LogInformation("Cache INVALIDATED by Prefix [{Prefix}] for Key: {CacheKey}", prefix, key);
        }

        return Task.CompletedTask;
    }
}
