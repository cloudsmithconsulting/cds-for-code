using Microsoft.Xrm.Sdk;
using System;
using System.Diagnostics;
using System.Linq;

namespace #{Namespace}.Plugins
{
    /// <summary>
    /// Base class for a Dynamics plugin.
    /// </summary>
    public abstract class DynamicsPlugin : IPlugin
    {
        /// <summary>
        /// Constructs a new instance of <see cref="DynamicsPlugin"/> using the default constructor.
        /// </summary>
        public DynamicsPlugin()
            : this(new StackTrace(false).GetFrame(1).GetMethod().DeclaringType, default, default)
        {
        }

        /// <summary>
        /// Constructs a new instance of <see cref="DynamicsPlugin"/> with an unsecure configuration.
        /// </summary>
        /// <param name="unsecure">A string representing the unsecure configuration</param>
        public DynamicsPlugin(string unsecure)
            : this(new StackTrace(false).GetFrame(1).GetMethod().DeclaringType, unsecure, default)
        {
        }

        /// <summary>
        /// Constructs a new instance of <see cref="DynamicsPlugin"/> with an unsecure configuration 
        /// and a secure configuration.
        /// </summary>
        /// <param name="unsecure">A string representing the unsecure configuration</param>
        /// <param name="secure">A string representing the secure configuration</param>
        public DynamicsPlugin(string unsecure, string secure)
            : this(new StackTrace(false).GetFrame(1).GetMethod().DeclaringType, unsecure, secure)
        {
        }

        internal DynamicsPlugin(Type type, string unsecure = null, string secure = null)
        {
            Configuration = new DynamicsPluginConfiguration(type, unsecure, secure);
        }

        /// <summary>
        /// Member of the <see cref="IPlugin"/> interface that is supplied for you.  This member
        /// cannot be overriden.  Use <see cref="Execute"/> instead.
        /// </summary>
        /// <param name="serviceProvider">The <see cref="IServiceProvider"/> interface supplied to the plugin.</param>
        public void Execute(IServiceProvider serviceProvider)
        {
            Plugin = new DynamicsPluginServices(serviceProvider);

            var attributePairs = Configuration.PluginType
                .GetCustomAttributes(typeof(DynamicsPluginAttribute), true)
                .GroupBy(a => a.GetType().Name)
                .ToDictionary(a => a.Key, a => a.Select(at => (DynamicsPluginAttribute)at).ToList());

            if (attributePairs != null && attributePairs.Count > 0)
            {
                foreach (var pair in attributePairs)
                {
                    pair.Value.ForEach(a => a.Validate(Configuration, Plugin));

                    var policy = pair.Value.First().ExceptionPolicy;
                    var allInvalid = pair.Value.All(a => !a.IsValid);
                    var anyInvalid = pair.Value.Any(a => !a.IsValid);
                    
                    if (anyInvalid)
                    {
                        Plugin.ValidationErrors.Add(
                            pair.Key, 
                            pair.Value.Where(a => !a.IsValid).Select(a => a.ErrorMessage).ToList());
                    }

                    if (policy == PluginValidationExceptionPolicy.ThrowIfAll && allInvalid)
                    {
                        var aggEx = new AggregateException(pair.Value.Select(v => new InvalidPluginExecutionException(v.ErrorMessage)).ToArray());

                        throw new InvalidPluginExecutionException($"Validation for '{Configuration.PluginType}' failed when checking rule '{pair.Key}'.  Multiple inner exceptions are included.", aggEx);
                    }

                    if (policy == PluginValidationExceptionPolicy.ThrowIfAny && anyInvalid)
                    {
                        var firstError = pair.Value.First(a => !a.IsValid).ErrorMessage;

                        throw new InvalidPluginExecutionException($"Validation for '{Configuration.PluginType}' failed when checking rule '{pair.Key}'.  The first error that was returned is: {firstError}");
                    }
                }
            }

            if (!Validate())
            {
                throw new InvalidPluginExecutionException($"Validation for '{Configuration.PluginType}' failed and the plugin cannot continue to execute.");
            }

            try
            {
                Execute();
            }
            catch (InvalidPluginExecutionException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException($"An exception occurred while attempting to execute '{Configuration.PluginType}'.  The exception message was: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Execution logic for a plugin goes here.
        /// </summary>
        public abstract void Execute();

        /// <summary>
        /// Returns true/false depending on what additional validation may be needed before the plugin executes.  Use
        /// this method for custom argument validation outside of the supplied <see cref="DynamicsPluginAttribute"/> types.
        /// </summary>
        /// <returns>Boolean indicating if validation passes or fails.  If <c>false</c>, throw an <see cref="InvalidPluginExecutionException"/>.</returns>
        public virtual bool Validate()
        {
            return true;
        }

        /// <summary>
        /// Gets the Dynamics plugin configuration that was supplied with registration for this plugin.
        /// </summary>
        protected DynamicsPluginConfiguration Configuration { get; private set; }

        /// <summary>
        /// Gets access to plugin services, including tracing and organization context, for use inside the plugin.
        /// </summary>
        protected DynamicsPluginServices Plugin { get; private set; }
    }
}
