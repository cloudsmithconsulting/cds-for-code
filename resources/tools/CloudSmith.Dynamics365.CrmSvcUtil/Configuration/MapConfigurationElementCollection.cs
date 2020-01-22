using System.Collections;
using System.Collections.Generic;
using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration
{
    /// <summary>
    /// Generic collection for CofigurationElement.
    /// </summary>
    /// <typeparam name="T">The type of configuration element contained in the collection.</typeparam>
    public abstract class MapConfigurationElementCollection<T> : ConfigurationElementCollection, IEnumerable<T>
        where T : ConfigurationElement, new()
    {
        protected MapConfigurationElementCollection()
        {
            T filter = (T)CreateNewElement();
            Add(filter);
        }

        public override ConfigurationElementCollectionType CollectionType => ConfigurationElementCollectionType.AddRemoveClearMap;

        protected override ConfigurationElement CreateNewElement()
        {
            return new T();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return GetElementKey((T)element);
        }

        protected abstract object GetElementKey(T element);

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