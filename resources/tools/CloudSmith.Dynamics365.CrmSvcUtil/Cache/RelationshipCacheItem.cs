using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public class RelationshipCacheItem : IHaveCacheKey, IParseCacheKey<string>, IParseMetadata<RelationshipMetadataBase>
    {
        public RelationshipCacheItem()
        {
            Key = new Func<string>(() => { return RelationshipName; });
            ParseKey = new Func<string, string>((relationship) => { RelationshipName = relationship; return Key(); });
            ParseMetadata = new Action<RelationshipMetadataBase>(m => 
            {
                var _1toM = m as OneToManyRelationshipMetadata;
                var _MtoM = m as ManyToManyRelationshipMetadata;

                Metadata = m;
                RelationshipName = m.SchemaName;
                FromEntity = _1toM != null ? _1toM.ReferencingEntity : _MtoM != null ? _MtoM.Entity1LogicalName : "";
                FromAttribute = _1toM != null ? _1toM.ReferencingAttribute : _MtoM != null ? _MtoM.Entity1IntersectAttribute : "";
                ToEntity = _1toM != null ? _1toM.ReferencedEntity : _MtoM != null ? _MtoM.Entity2LogicalName : "";
                ToAttribute = _1toM != null ? _1toM.ReferencedAttribute : _MtoM != null ? _MtoM.Entity2IntersectAttribute : "";
                IsOneToMany = _1toM != null;
                IsManyToMany = _MtoM != null;
            });
        }
        public RelationshipCacheItem(RelationshipMetadataBase metadata) : this() { ParseMetadata(metadata); }

        public Func<string> Key { get; }
        public Func<string, string> ParseKey { get; }
        public Action<RelationshipMetadataBase> ParseMetadata { get; }

        public RelationshipMetadataBase Metadata { get; private set; }

        public string FromEntity { get; set; }
        public string FromAttribute { get; set; }
        public string ToEntity { get; set; }
        public string ToAttribute { get; set; }
        public string RelationshipName { get; set; }
        public bool IsOneToMany { get; set; }
        public bool IsManyToMany { get; set; }
        public string GeneratedTypeName { get; set; }
    }
}
