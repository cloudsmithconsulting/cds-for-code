using System;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil
{
    public static class Arguments
    {
        public static string GetArgument(params string[] keys)
        {
            foreach (string key in keys)
            {
                string[] args = Environment.GetCommandLineArgs();
                var arg = args.FirstOrDefault(a => a.ToLowerInvariant().StartsWith("/" + key.ToLowerInvariant()));

                if (!string.IsNullOrEmpty(arg))
                {
                    var firstColonPosition = arg.IndexOf(':');
                    var value = arg.Substring(firstColonPosition + 1).Trim(new[] { '"' });

                    return value;
                }
                else
                {
                    var setting = System.Configuration.ConfigurationManager.AppSettings[key];

                    if (!string.IsNullOrEmpty(setting))
                        return setting;
                }
            }

            return null;
        }
    }
}
