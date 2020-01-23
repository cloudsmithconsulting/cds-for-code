using Microsoft.Xrm.Sdk;
using System;

namespace #{Namespace}.Plugins
{
    public abstract class DynamicsPluginAttribute : Attribute
    {
        protected DynamicsPluginAttribute()
        {
            IsValid = true;
            ExceptionPolicy = PluginValidationExceptionPolicy.ThrowImmediately;
        }

        protected DynamicsPluginAttribute(PluginValidationExceptionPolicy exceptionPolicy)
        {
            IsValid = true;
            ExceptionPolicy = exceptionPolicy;
        }

        public abstract void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services);

        public PluginValidationExceptionPolicy ExceptionPolicy { get; protected set; }
        public bool IsValid { get; private set; }
        public string ErrorMessage { get; private set; }

        public void Fail(string message)
        {
            IsValid = false;
            ErrorMessage = message;

            if (ExceptionPolicy == PluginValidationExceptionPolicy.ThrowImmediately)
            {
                throw new InvalidPluginExecutionException(ErrorMessage);
            }
        }
    }

    public enum PluginValidationExceptionPolicy
    {
        DontThrow,
        ThrowImmediately,
        ThrowIfAll,
        ThrowIfAny
    }
}
