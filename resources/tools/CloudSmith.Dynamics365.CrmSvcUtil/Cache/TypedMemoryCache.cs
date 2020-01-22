using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.Caching;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    /// <summary>
    /// A type-safe in-memory cache implementation that is a fascade for MemoryCache.
    /// </summary>
    /// <typeparam name="TKey">The type of Key to use (must be convertable to string)</typeparam>
    /// <typeparam name="T">The type of objet to house.</typeparam>
    public class TypedMemoryCache<TKey, T> : IEnumerable<KeyValuePair<TKey, T>>, IDisposable
    {
        private readonly MemoryCache _cache;
        private readonly Func<T, TKey> _keySelector;
        private readonly CacheItemPolicy _defaultPolicy;
        private readonly Func<string, TKey> _keyConverter;

        /// <summary>
        ///     Constructs an instance of a TypedMemoryCache with key selector and default
        ///     settings.
        /// </summary>
        /// <param name="keySelector">
        ///     A function that resolves a key from a cache item.  This function is used to
        ///     automatically add cache keys from their items where needed.
        /// </param>
        public TypedMemoryCache(Func<T, TKey> keySelector) : this(keySelector, null) { }

        /// <summary>
        ///     Constructs an instance of a TypedMemoryCache with key selector and settings.
        /// </summary>
        /// <param name="keySelector">
        ///     A function that resolves a key from a cache item.  This function is used to
        ///     automatically add cache keys from their items where needed.
        /// </param>
        /// <param name="settings">
        ///     Cache optimization settings.
        /// </param>
        public TypedMemoryCache(Func<T, TKey> keySelector, MemoryCacheSettings settings = null) 
        {
            _keySelector = keySelector ?? throw new ArgumentNullException(nameof(keySelector));

            settings = settings ?? MemoryCacheSettings.Default();

            _defaultPolicy = settings.Policy();
            _cache = new MemoryCache(typeof(T).Name, settings.ToCollection());

            // Initialize a conversion function for mapping keys back to strings.
            var converter = TypeDescriptor.GetConverter(typeof(TKey));
            var canConvert = converter.CanConvertTo(typeof(string));

            if (canConvert)
                _keyConverter = key => { return (TKey)converter.ConvertTo(key, typeof(TKey)); };
            else
                _keyConverter = key => { return (TKey)(object)key; };
        }

        /// <summary>
        ///     Gets or sets a value in the cache by using the default indexer property for an
        ///     instance of the System.Runtime.Caching.MemoryCache class.
        /// </summary>
        /// <param name="key">A unique identifier for the cache value to get or set.</param>
        /// <returns>The value in the cache instance for the specified key, if the entry exists; otherwise, null.</returns>
        /// <exception cref="System.ArgumentNullException">key is null *or* the inserted value is null.</exception>
        public virtual T this[TKey key]
        {
            get { return (T)_cache[key.ToString()]; }
            set { _cache[key.ToString()] = value; }
        }

        /// <summary>
        ///     Gets the percentage of physical memory that the cache can use.
        /// </summary>
        /// <value>
        ///     The percentage of physical memory that the cache can use.
        /// </value>
        public virtual long PhysicalMemoryLimit { get { return _cache.PhysicalMemoryLimit; } }

        /// <summary>
        ///     Gets the name of the cache.
        /// </summary>
        /// <value>
        ///     The name of the cache.
        /// </value>
        public virtual string Name { get { return _cache.Name; } }

        /// <summary>
        ///     Gets the amount of memory on the computer, in bytes, that can be used by the
        ///     cache.
        /// </summary>
        /// <value>
        ///     The amount of memory in bytes.
        /// </value>
        public virtual long CacheMemoryLimit { get { return _cache.CacheMemoryLimit; } }

        /// <summary>
        ///     Gets the maximum time after which the cache updates its memory statistics.
        /// </summary>
        /// <value>
        ///     The maximum time that can occur before memory statistics are updated.
        /// </value>
        public virtual TimeSpan PollingInterval { get { return _cache.PollingInterval; } }

        /// <summary>
        ///     Gets a description of the features that the cache provides.
        /// </summary>
        /// <value>
        ///     A bitwise combination of flags that indicate the default capabilities of the
        ///     cache implementation.
        /// </value>
        public virtual DefaultCacheCapabilities DefaultCacheCapabilities { get { return _cache.DefaultCacheCapabilities; } }

        /// <summary>
        ///     Inserts a cache entry into the cache as a System.Runtime.Caching.CacheItem instance,
        ///     and adds details about how the entry should be evicted.
        /// </summary>
        /// <param name="item">
        ///     The object to add.
        /// </param>
        /// <param name="policy">
        ///     An object that contains eviction details for the cache entry. This object provides
        ///     more options for eviction than a simple absolute expiration.
        /// </param>
        /// <returns>
        ///     true if insertion succeeded, or false if there is an already an entry in the
        ///     cache that has the same key as item.
        /// </returns>
        public virtual bool Add(CacheItem item, CacheItemPolicy policy)
        {
            return _cache.Add(item, policy);
        }

        /// <summary>
        ///     Inserts a cache entry into the cache as a System.Runtime.Caching.CacheItem instance,
        ///     and adds details about how the entry should be evicted.
        /// </summary>
        /// <param name="item">
        ///     The object to add.
        /// </param>
        /// <returns>
        ///     true if insertion succeeded, or false if there is an already an entry in the
        ///     cache that has the same key as item.
        /// </returns>
        public virtual bool Add(CacheItem item)
        {
            return Add(item, _defaultPolicy);
        }

        /// <summary>
        ///     Adds a cache entry into the cache using the specified key and a value and an
        ///     absolute expiration value.
        /// </summary>
        /// <param name="key">
        ///     A unique identifier for the cache entry to add.
        /// </param>
        /// <param name="value">
        ///     The data for the cache entry.
        /// </param>
        /// <param name="absoluteExpiration">
        ///     The fixed date and time at which the cache entry will expire.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry can be added. Do not pass
        ///     a value for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     If a cache entry with the same key exists, the existing cache entry; otherwise,
        ///     null.
        /// </returns>
        /// <exception cref="System.ArgumentNullException">
        ///     key is null.
        /// </exception>
        /// <exception cref="System.ArgumentNullException">
        ///     value is null.
        /// </exception>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An System.Runtime.Caching.CacheItemPolicy.UpdateCallback property has been supplied.
        ///     The Overload:System.Runtime.Caching.ObjectCache.Add and the Overload:System.Runtime.Caching.ObjectCache.AddOrGetExisting
        ///     method overloads do not support the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property. Therefore, to set the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property for a cache entry, use the Overload:System.Runtime.Caching.MemoryCache.Set
        ///     overloads instead.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     Both the absolute and sliding expiration values for the System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration fields. The System.Runtime.Caching.MemoryCache
        ///     class cannot set expiration policy based on a combination of an absolute expiration
        ///     and a sliding expiration. Only one expiration setting can be explicitly set when
        ///     you use the System.Runtime.Caching.MemoryCache instance. The other expiration
        ///     setting must be set to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     or System.Runtime.Caching.ObjectCache.NoSlidingExpiration
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     property is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        public virtual T AddOrGetExisting(TKey key, T value, DateTimeOffset absoluteExpiration, string regionName = null)
        {
            return (T)_cache.AddOrGetExisting(key.ToString(), value, absoluteExpiration, regionName);
        }

        /// <summary>
        ///     Adds a cache entry into the cache using the key selector function and a value and an
        ///     absolute expiration value.
        /// </summary>
        /// <param name="value">
        ///     The data for the cache entry.
        /// </param>
        /// <param name="absoluteExpiration">
        ///     The fixed date and time at which the cache entry will expire.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry can be added. Do not pass
        ///     a value for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     If a cache entry with the same key exists, the existing cache entry; otherwise,
        ///     null.
        /// </returns>
        /// <exception cref="System.ArgumentNullException">
        ///     key is null.
        /// </exception>
        /// <exception cref="System.ArgumentNullException">
        ///     value is null.
        /// </exception>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An System.Runtime.Caching.CacheItemPolicy.UpdateCallback property has been supplied.
        ///     The Overload:System.Runtime.Caching.ObjectCache.Add and the Overload:System.Runtime.Caching.ObjectCache.AddOrGetExisting
        ///     method overloads do not support the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property. Therefore, to set the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property for a cache entry, use the Overload:System.Runtime.Caching.MemoryCache.Set
        ///     overloads instead.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     Both the absolute and sliding expiration values for the System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration fields. The System.Runtime.Caching.MemoryCache
        ///     class cannot set expiration policy based on a combination of an absolute expiration
        ///     and a sliding expiration. Only one expiration setting can be explicitly set when
        ///     you use the System.Runtime.Caching.MemoryCache instance. The other expiration
        ///     setting must be set to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     or System.Runtime.Caching.ObjectCache.NoSlidingExpiration
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     property is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        public virtual T AddOrGetExisting(T value, DateTimeOffset absoluteExpiration, string regionName = null)
        {
            return AddOrGetExisting(_keySelector(value), value, absoluteExpiration, regionName);
        }

        /// <summary>
        ///     Adds a cache entry into the cache using the specified System.Runtime.Caching.CacheItem
        ///     instance and details about how to evict the entry.
        /// </summary>
        /// <param name="item">
        ///     The object to add.
        /// </param>
        /// <param name="policy">
        ///     An object that contains eviction details for the cache entry. This object provides
        ///     more options for eviction than a simple absolute expiration.
        /// </param>
        /// <returns>
        ///     If a cache entry with the same key exists, the existing cache entry; otherwise,
        ///     null.
        /// </returns>
        /// <exception cref="System.ArgumentNullException">
        ///     item is null.
        /// </exception>
        /// <exception cref="System.ArgumentNullException">
        ///     The <see cref="System.Runtime.Caching.CacheItem.Value"/> property is null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An System.Runtime.Caching.CacheItemPolicy.UpdateCallback property has been supplied.
        ///     The Overload:System.Runtime.Caching.ObjectCache.Add and Overload:System.Runtime.Caching.ObjectCache.AddOrGetExisting
        ///     method overloads do not support the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property. Therefore, to set the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property for a cache entry, use the Overload:System.Runtime.Caching.MemoryCache.Set
        ///     method overloads instead.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     Both the absolute and sliding expiration values for the System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration fields. The System.Runtime.Caching.MemoryCache
        ///     class cannot set expiration policy based on a combination of an absolute expiration
        ///     and a sliding expiration. Only one expiration setting can be explicitly set when
        ///     you use the System.Runtime.Caching.MemoryCache instance. The other expiration
        ///     setting must be set to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     field or System.Runtime.Caching.ObjectCache.NoSlidingExpiration field.
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     property is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        public virtual CacheItem AddOrGetExisting(CacheItem item, CacheItemPolicy policy)
        {
            return _cache.AddOrGetExisting(item, policy);
        }

        /// <summary>
        ///     Inserts a cache entry into the cache using the specified key and value and the
        ///     specified details for how it is to be evicted.
        /// </summary>
        /// <param name="key">
        ///     A unique identifier for the cache entry to add or get.
        /// </param>
        /// <param name="value">
        ///     The data for the cache entry.
        /// </param>
        /// <param name="policy">
        ///     An object that contains eviction details for the cache entry. This object provides
        ///     more options for eviction than a simple absolute expiration.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry can be added. Do not pass
        ///     a value for this parameter. By default, this parameter is null, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     If a matching cache entry already exists, a cache entry; otherwise, null.
        /// </returns>
        /// <exception cref="System.ArgumentNullException">
        ///     key is null.
        /// </exception>
        /// <exception cref="System.ArgumentNullException">
        ///     value is null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An System.Runtime.Caching.CacheItemPolicy.UpdateCallback property has been supplied.
        ///     The Overload:System.Runtime.Caching.ObjectCache.Add and Overload:System.Runtime.Caching.ObjectCache.AddOrGetExisting
        ///     method overloads do not support the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property. Therefore, to set the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property for a cache entry, use the Overload:System.Runtime.Caching.MemoryCache.Set
        ///     method overloads instead.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     Both the absolute and sliding expiration values for the System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration fields. The System.Runtime.Caching.MemoryCache
        ///     class cannot set expiration policy based on a combination of an absolute expiration
        ///     and a sliding expiration. Only one expiration setting can be explicitly set when
        ///     you use the System.Runtime.Caching.MemoryCache instance. The other expiration
        ///     setting must be set to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     field or System.Runtime.Caching.ObjectCache.NoSlidingExpiration field.
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     property is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        public virtual T AddOrGetExisting(TKey key, T value, CacheItemPolicy policy, string regionName = null)
        {
            return (T)_cache.AddOrGetExisting(key.ToString(), value, policy, regionName);
        }

        /// <summary>
        ///     Inserts a cache entry into the cache using the provided key selector function and value and the
        ///     specified details for how it is to be evicted.
        /// </summary>
        /// <param name="value">
        ///     The data for the cache entry.
        /// </param>
        /// <param name="policy">
        ///     An object that contains eviction details for the cache entry. This object provides
        ///     more options for eviction than a simple absolute expiration.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry can be added. Do not pass
        ///     a value for this parameter. By default, this parameter is null, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     If a matching cache entry already exists, a cache entry; otherwise, null.
        /// </returns>
        /// <exception cref="System.ArgumentNullException">
        ///     value is null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An System.Runtime.Caching.CacheItemPolicy.UpdateCallback property has been supplied.
        ///     The Overload:System.Runtime.Caching.ObjectCache.Add and Overload:System.Runtime.Caching.ObjectCache.AddOrGetExisting
        ///     method overloads do not support the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property. Therefore, to set the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property for a cache entry, use the Overload:System.Runtime.Caching.MemoryCache.Set
        ///     method overloads instead.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     Both the absolute and sliding expiration values for the System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration fields. The System.Runtime.Caching.MemoryCache
        ///     class cannot set expiration policy based on a combination of an absolute expiration
        ///     and a sliding expiration. Only one expiration setting can be explicitly set when
        ///     you use the System.Runtime.Caching.MemoryCache instance. The other expiration
        ///     setting must be set to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     field or System.Runtime.Caching.ObjectCache.NoSlidingExpiration field.
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     property is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        public virtual T AddOrGetExisting(T value, CacheItemPolicy policy, string regionName = null)
        {
            return AddOrGetExisting(_keySelector(value), value, policy, regionName);
        }

        /// <summary>
        ///     Inserts a cache entry into the cache using the provided key selector function and value and the
        ///     default eviction policy.
        /// </summary>
        /// <param name="value">
        ///     The data for the cache entry.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry can be added. Do not pass
        ///     a value for this parameter. By default, this parameter is null, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     If a matching cache entry already exists, a cache entry; otherwise, null.
        /// </returns>
        /// <exception cref="System.ArgumentNullException">
        ///     value is null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An System.Runtime.Caching.CacheItemPolicy.UpdateCallback property has been supplied.
        ///     The Overload:System.Runtime.Caching.ObjectCache.Add and Overload:System.Runtime.Caching.ObjectCache.AddOrGetExisting
        ///     method overloads do not support the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property. Therefore, to set the System.Runtime.Caching.CacheItemPolicy.UpdateCallback
        ///     property for a cache entry, use the Overload:System.Runtime.Caching.MemoryCache.Set
        ///     method overloads instead.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     Both the absolute and sliding expiration values for the System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration fields. The System.Runtime.Caching.MemoryCache
        ///     class cannot set expiration policy based on a combination of an absolute expiration
        ///     and a sliding expiration. Only one expiration setting can be explicitly set when
        ///     you use the System.Runtime.Caching.MemoryCache instance. The other expiration
        ///     setting must be set to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     field or System.Runtime.Caching.ObjectCache.NoSlidingExpiration field.
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     property is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        public virtual T AddOrGetExisting(T value, string regionName = null)
        {
            return AddOrGetExisting(_keySelector(value), value, _defaultPolicy, regionName);
        }

        /// <summary>
        ///     Determines whether a cache entry exists in the cache.
        /// </summary>
        /// <param name="key">
        ///     A unique identifier for the cache entry to search for.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry was added. Do not pass a value
        ///     for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     true if the cache contains a cache entry whose key matches key; otherwise, false.
        /// </returns>
        /// <exception cref="System.ArgumentNullException">
        ///     key is null.
        /// </exception>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        public virtual bool Contains(TKey key, string regionName = null)
        {
            return _cache.Contains(key.ToString(), regionName);
        }

        /// <summary>
        ///     Creates a System.Runtime.Caching.CacheEntryChangeMonitor object that can trigger
        ///     events in response to changes to specified cache entries.
        /// </summary>
        /// <param name="keys">
        ///     An enumeration of unique cache entry keys for the System.Runtime.Caching.CacheEntryChangeMonitor
        ///     object.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry can be added. Do not pass
        ///     a value for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     A change monitor that monitors entries in the cache.
        /// </returns>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        /// <exception cref="System.ArgumentNullException">
        ///     keys is null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     The number of items in keys is zero.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An item in the keys collection is null.
        /// </exception>
        public virtual CacheEntryChangeMonitor CreateCacheEntryChangeMonitor(IEnumerable<TKey> keys, string regionName = null)
        {
            return _cache.CreateCacheEntryChangeMonitor(keys.Select(k => k.ToString()), regionName);
        }

        /// <summary>
        ///     Disposes of the cache and the items inside of it.
        /// </summary>
        public void Dispose()
        {
            _cache.Dispose();
        }

        /// <summary>
        ///     Returns an entry from the cache.
        /// </summary>
        /// <param name="key">
        ///     A unique identifier for the cache entry to get.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry was added. Do not pass a value
        ///     for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     A reference to the cache entry that is identified by key, if the entry exists;
        ///     otherwise, null.
        /// </returns>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        /// <exception cref="System.ArgumentNullException">
        ///     key is null.
        /// </exception>
        public virtual T Get(TKey key, string regionName = null)
        {
            return (T)_cache.Get(key.ToString(), regionName);
        }

        /// <summary>
        ///     Returns the specified entry from the cache as a System.Runtime.Caching.CacheItem
        ///     instance.
        /// </summary>
        /// <param name="key">
        ///     A unique identifier for the cache entry to get.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry was added. Do not pass a value
        ///     for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     A reference to the cache entry identified by key if the entry exists; otherwise,
        ///     null.
        /// </returns>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        /// <exception cref="System.ArgumentNullException">
        ///     key is null.
        /// </exception>
        public virtual CacheItem GetCacheItem(TKey key, string regionName = null)
        {
            return _cache.GetCacheItem(key.ToString(), regionName);
        }

        /// <summary>
        ///     Returns the total number of cache entries in the cache.
        /// </summary>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry was added. Do not pass a value
        ///     for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     The number of entries in the cache.
        /// </returns>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        public virtual long GetCount(string regionName = null)
        {
            return _cache.GetCount(regionName);
        }

        /// <summary>
        ///     Gets the size of the named region.
        /// </summary>
        /// <param name="regionName">
        ///     The name of the region.
        /// </param>
        /// <returns>
        ///     The size of the named region.
        /// </returns>
        public long GetLastSize(string regionName = null)
        {
            return _cache.GetLastSize(regionName);
        }

        /// <summary>
        ///     Returns a set of cache entries that correspond to the specified keys.
        /// </summary>
        /// <param name="keys">
        ///     A set of unique identifiers for the cache entries to return.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry was added. Do not pass a value
        ///     for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     A set of cache entries that correspond to the specified keys.
        /// </returns>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        /// <exception cref="System.ArgumentNullException">
        ///     keys is null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An individual key in the collection is null.
        /// </exception>
        public virtual IDictionary<TKey, T> GetValues(IEnumerable<TKey> keys, string regionName = null)
        {
            return (IDictionary<TKey, T>)_cache.GetValues(keys.Select(k => k.ToString()), regionName);
        }

        /// <summary>
        ///     Removes a cache entry from the cache.
        /// </summary>
        /// <param name="key">
        ///     A unique identifier for the cache entry to remove.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry was added. Do not pass a value
        ///     for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     If the entry is found in the cache, the removed cache entry; otherwise, null.
        /// </returns>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        /// <exception cref="System.ArgumentNullException">
        ///     key is null.
        /// </exception>
        public virtual T Remove(TKey key, string regionName = null)
        {
            return (T)_cache.Remove(key.ToString(), regionName);
        }

        /// <summary>
        ///     Removes a cache entry from the cache using the reason.
        /// </summary>
        /// <param name="key">
        ///     A unique identifier for the cache entry to remove.
        /// </param>
        /// <param name="reason">
        ///     The reason the item was removed.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry was added. Do not pass a value
        ///     for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <returns>
        ///     If the entry is found in the cache, the removed cache entry; otherwise, null.
        /// </returns>
        public virtual T Remove(TKey key, CacheEntryRemovedReason reason, string regionName = null)
        {
            return (T)_cache.Remove(key.ToString(), reason, regionName);
        }

        /// <summary>
        ///     Inserts a cache entry into the cache by using a key and a value and eviction.
        /// </summary>
        /// <param name="key">
        ///     A unique identifier for the cache entry to insert.
        /// </param>
        /// <param name="value">
        ///     The data for the cache entry.
        /// </param>
        /// <param name="policy">
        ///     An object that contains eviction details for the cache entry. This object provides
        ///     more options for eviction than a simple absolute expiration.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry can be added. Do not pass
        ///     a value for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <exception cref="System.ArgumentNullException">
        ///     key is null.-or- value is null-or-The callback reference that was passed to the
        ///     helper method in the System.Runtime.Caching.CacheItemPolicy.UpdateCallback property
        ///     is null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An invalid combination of arguments for the cache entry exists. This occurs if
        ///     the following expiration details are set on the policy object for the cache entry:If
        ///     both the absolute and sliding expiration values on System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration. This is because the
        ///     System.Runtime.Caching.MemoryCache class does not support expiring entries based
        ///     on both an absolute and a sliding expiration. Only one expiration setting can
        ///     be explicitly set when you use the System.Runtime.Caching.MemoryCache class.
        ///     The other setting must be set to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     or System.Runtime.Caching.ObjectCache.NoSlidingExpiration. If both the removal
        ///     callback and the update callback are specified on System.Runtime.Caching.CacheItemPolicy
        ///     class. The System.Runtime.Caching.MemoryCache class only supports using one type
        ///     of callback per cache entry.
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     property is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        public virtual void Set(TKey key, T value, CacheItemPolicy policy, string regionName = null)
        {
            _cache.Set(key.ToString(), value, policy, regionName);
        }

        /// <summary>
        ///     Inserts a cache entry into the cache by using a key and a value and the default 
        ///     eviction policy.
        /// </summary>
        /// <param name="key">
        ///     A unique identifier for the cache entry to insert.
        /// </param>
        /// <param name="value">
        ///     The data for the cache entry.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry can be added. Do not pass
        ///     a value for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <exception cref="System.ArgumentNullException">
        ///     key is null.-or- value is null-or-The callback reference that was passed to the
        ///     helper method in the System.Runtime.Caching.CacheItemPolicy.UpdateCallback property
        ///     is null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An invalid combination of arguments for the cache entry exists. This occurs if
        ///     the following expiration details are set on the policy object for the cache entry:If
        ///     both the absolute and sliding expiration values on System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration. This is because the
        ///     System.Runtime.Caching.MemoryCache class does not support expiring entries based
        ///     on both an absolute and a sliding expiration. Only one expiration setting can
        ///     be explicitly set when you use the System.Runtime.Caching.MemoryCache class.
        ///     The other setting must be set to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     or System.Runtime.Caching.ObjectCache.NoSlidingExpiration. If both the removal
        ///     callback and the update callback are specified on System.Runtime.Caching.CacheItemPolicy
        ///     class. The System.Runtime.Caching.MemoryCache class only supports using one type
        ///     of callback per cache entry.
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     property is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        public virtual void Set(TKey key, T value, string regionName = null)
        {
            Set(key, value, _defaultPolicy, regionName);
        }

        /// <summary>
        ///     Inserts a cache entry into the cache by using a value and the default 
        ///     eviction policy, extracting a key with the supplied key selector.
        /// </summary>
        /// <param name="value">
        ///     The data for the cache entry.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry can be added. Do not pass
        ///     a value for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <exception cref="System.ArgumentNullException">
        ///     key is null.-or- value is null-or-The callback reference that was passed to the
        ///     helper method in the System.Runtime.Caching.CacheItemPolicy.UpdateCallback property
        ///     is null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An invalid combination of arguments for the cache entry exists. This occurs if
        ///     the following expiration details are set on the policy object for the cache entry:If
        ///     both the absolute and sliding expiration values on System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration. This is because the
        ///     System.Runtime.Caching.MemoryCache class does not support expiring entries based
        ///     on both an absolute and a sliding expiration. Only one expiration setting can
        ///     be explicitly set when you use the System.Runtime.Caching.MemoryCache class.
        ///     The other setting must be set to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     or System.Runtime.Caching.ObjectCache.NoSlidingExpiration. If both the removal
        ///     callback and the update callback are specified on System.Runtime.Caching.CacheItemPolicy
        ///     class. The System.Runtime.Caching.MemoryCache class only supports using one type
        ///     of callback per cache entry.
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     property is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        /// <exception cref="System.NotSupportedException">
        ///     regionName is not null.
        /// </exception>
        public virtual void Set(T value, string regionName = null)
        {
            Set(_keySelector(value), value, _defaultPolicy, regionName);
        }

        /// <summary>
        ///     Inserts a cache entry into the cache by using a System.Runtime.Caching.CacheItem
        ///     instance to supply the key and value for the cache entry.
        /// </summary>
        /// <param name="item">
        ///     An object that represents a cache entry to insert.
        /// </param>
        /// <param name="policy">
        ///     An object that contains eviction details for the cache entry. This object provides
        ///     more options for eviction than a simple absolute expiration.
        /// </param>
        /// <exception cref="System.ArgumentNullException">
        ///     item is null.-or-The System.Runtime.Caching.CacheItem.Key property is null.-or-The
        ///     System.Runtime.Caching.CacheItem.Value property is null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     An invalid combination of arguments for the cache entry was passed. This occurs
        ///     if the following expiration details are set on the policy object for the cache
        ///     entry:If both the absolute and sliding expiration values of the System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration fields. The System.Runtime.Caching.MemoryCache
        ///     class cannot set expiration policy based on both an absolute expiration and a
        ///     sliding expiration. Only one expiration setting can be explicitly set when you
        ///     use the System.Runtime.Caching.MemoryCache class. The other setting must be set
        ///     to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration or System.Runtime.Caching.ObjectCache.NoSlidingExpiration
        ///     property. If both the removal callback and the update callback are specified
        ///     for System.Runtime.Caching.CacheItemPolicy object. The System.Runtime.Caching.MemoryCache
        ///     class only supports using one type of callback per cache entry.
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        public virtual void Set(CacheItem item, CacheItemPolicy policy)
        {
            _cache.Set(item, policy);
        }

        /// <summary>
        ///     Inserts a cache entry into the cache by using a key and a value and specifies
        ///     time-based expiration details.
        /// </summary>
        /// <param name="key">
        ///     A unique identifier for the cache entry to insert.
        /// </param>
        /// <param name="value">
        ///     The data for the cache entry.
        /// </param>
        /// <param name="absoluteExpiration">
        ///     The fixed date and time at which the cache entry will expire.
        /// </param>
        /// <param name="regionName">
        ///     A named region in the cache to which a cache entry can be added. Do not pass
        ///     a value for this parameter. This parameter is null by default, because the System.Runtime.Caching.MemoryCache
        ///     class does not implement regions.
        /// </param>
        /// <exception cref="System.ArgumentNullException">
        ///     regionName is not null.
        /// </exception>
        /// <exception cref="System.ArgumentException">
        ///     key is null.-or- Value is null.
        /// </exception>
        /// <exception cref="System.ArgumentOutOfRangeException">
        ///     An invalid combination of arguments for the cache entry was passed. This occurs
        ///     if the following expiration details are set on the policy object for the cache
        ///     entry:If both the absolute and sliding expiration values on System.Runtime.Caching.CacheItemPolicy
        ///     object are set to values other than the defaults of System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     and System.Runtime.Caching.ObjectCache.NoSlidingExpiration. This occurs because
        ///     the System.Runtime.Caching.MemoryCache class does not support expiring entries
        ///     based on both an absolute and a sliding expiration. Only one expiration setting
        ///     can be explicitly set when you use the System.Runtime.Caching.MemoryCache class.
        ///     The other setting must be set to System.Runtime.Caching.ObjectCache.InfiniteAbsoluteExpiration
        ///     or System.Runtime.Caching.ObjectCache.NoSlidingExpiration. If both the removal
        ///     callback and the update callback are specified on System.Runtime.Caching.CacheItemPolicy
        ///     object. The System.Runtime.Caching.MemoryCache class only supports using one
        ///     type of callback per cache entry.
        /// </exception>
        /// <exception cref="System.NotSupportedException">
        ///     The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration property is set
        ///     to a value less than System.TimeSpan.Zero. -or-The System.Runtime.Caching.CacheItemPolicy.SlidingExpiration
        ///     property is set to a value greater than one year.-or-The System.Runtime.Caching.CacheItemPolicy.Priority
        ///     property is not a value of the System.Runtime.Caching.CacheItemPriority enumeration.
        /// </exception>
        public virtual void Set(TKey key, T value, DateTimeOffset absoluteExpiration, string regionName = null)
        {
            _cache.Set(key.ToString(), value, absoluteExpiration, regionName);
        }

        /// <summary>
        ///     Removes a specified percentage of cache entries from the cache object.
        /// </summary>
        /// <param name="percent">
        ///     The percentage of total cache entries to remove.
        /// </param>
        /// <returns>
        ///     The number of entries removed from the cache.
        /// </returns>
        public long Trim(int percent)
        {
            return _cache.Trim(percent);
        }

        /// <summary>
        ///     Implements IEnumerable{KeyValuePair{<typeparamref name="TKey"/>, <typeparamref name="T"/>}}.
        /// </summary>
        /// <returns>
        ///     Enumerator
        /// </returns>
        IEnumerator<KeyValuePair<TKey, T>> IEnumerable<KeyValuePair<TKey, T>>.GetEnumerator()
        {
            foreach (var item in _cache)
            {
                yield return new KeyValuePair<TKey, T>(_keyConverter(item.Key), (T)item.Value);
            }
        }

        /// <summary>
        ///     Implements IEnumerable
        /// </summary>
        /// <returns>
        ///     Enumerator
        /// </returns>
        IEnumerator IEnumerable.GetEnumerator()
        {
            foreach (var item in _cache)
            {
                yield return item;
            }
        }
    }
}
