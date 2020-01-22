using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter
{
    public class FilterListElementCollection : MultipleConfigurationElementCollection<RegExFilterElement>
    {
        protected override Dictionary<string, Type> ElementNameMappings => new Dictionary<string, Type>
        {
            { "entity", typeof(RegExFilterElement) },
            { "attribute", typeof(AllowsEntityRegExElement) },
            { "optionSet", typeof(AllowsEntityRegExElement) }
        };

        /// <inheritdoc />
        protected override object GetElementKey(RegExFilterElement element)
        {
            var entity = (element as AllowsEntityRegExElement)?.Entity;

            if (!string.IsNullOrEmpty(entity))
            {
                return $"{entity}.{element.Expression}";
            }

            return element.Expression;
        }

        public IFilterElement[] GetFilters<T>()
            where T : class, IFilterElement
        {
            return this
                .Select(f => (IFilterElement)(f as T))
                .ToArray();
        }

        public IFilterElement[] GetFilters(FilterMember member)
        {
            return this
                .Where(f => f.Filter == member)
                .Select(f => f as IFilterElement)
                .ToArray();
        }
    }

    public class EntityListElementCollection : MapConfigurationElementCollection<EntityListElement>
    {
        /// <inheritdoc />
        protected override object GetElementKey(EntityListElement element)
        {
            return element.Entity;
        }
    }

    public class AttributeListElementCollection : MapConfigurationElementCollection<AttributeListElement>
    {
        /// <inheritdoc />
        protected override object GetElementKey(AttributeListElement element)
        {
            return $"{element.Entity}.{element.Attribute}";
        }
    }

    public class OptionSetListElementCollection : MapConfigurationElementCollection<OptionSetListElement>
    {
        /// <inheritdoc />
        protected override object GetElementKey(OptionSetListElement element)
        {
            return $"{element.Entity}.{element.OptionSet}";
        }
    }

    public class SolutionFilterElementCollection : MapConfigurationElementCollection<SolutionFilterElement>
    {
        /// <inheritdoc />
        protected override object GetElementKey(SolutionFilterElement element)
        {
            return element.SolutionName;
        }
    }
}