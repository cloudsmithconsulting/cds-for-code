using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration
{
    /// <summary>
    /// Generic collection for CofigurationElement.
    /// </summary>
    /// <typeparam name="T">The type of configuration element contained in the collection.</typeparam>
    public abstract class MultipleConfigurationElementCollection<T> : ConfigurationElementCollection, IEnumerable<T>
        where T : ConfigurationElement, new()
    {
        private string _elementName;

        protected MultipleConfigurationElementCollection()
        {
        }

        protected abstract Dictionary<string, Type> ElementNameMappings { get; }

        public override ConfigurationElementCollectionType CollectionType => ConfigurationElementCollectionType.BasicMap;

        protected override ConfigurationElement CreateNewElement()
        {
            if (!string.IsNullOrEmpty(_elementName) && ElementNameMappings[_elementName] != null)
            {
                return (ConfigurationElement)Activator.CreateInstance(ElementNameMappings[_elementName]);
            }

            return new T();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return GetElementKey((T)element);
        }

        protected abstract object GetElementKey(T element);

        protected override bool IsElementName(string elementName)
        {
            _elementName = elementName;

            if (ElementNameMappings.Keys.Any(e => string.Equals(elementName, e, StringComparison.InvariantCultureIgnoreCase)))
            {
                return true;
            }

            return base.IsElementName(elementName);
        }

        public T this[int index]
        {
            get => (T)BaseGet(index);
            set
            {
                if (BaseGet(index) != null)
                {
                    BaseRemoveAt(index);
                }

                BaseAdd(index, value);
            }
        }

        public new T this[string name] => (T)BaseGet(name);

        public int IndexOf(T element)
        {
            return BaseIndexOf(element);
        }

        public void Add(T element)
        {
            BaseAdd(element);
        }

        protected override void BaseAdd(ConfigurationElement element)
        {
            BaseAdd(element, false);
        }

        public void Remove(T element)
        {
            if (BaseIndexOf(element) >= 0)
                BaseRemove(GetElementKey(element));
        }

        public void RemoveAt(int index)
        {
            BaseRemoveAt(index);
        }

        public void Remove(string name)
        {
            BaseRemove(name);
        }

        public void Clear()
        {
            BaseClear();
        }

        /// <inheritdoc />
        public new IEnumerator<T> GetEnumerator()
        {
            IEnumerator enumerator = base.GetEnumerator();

            while (enumerator.MoveNext())
            {
                yield return (T)enumerator.Current;
            }
        }
    }
}