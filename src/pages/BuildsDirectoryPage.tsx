import React, { useState, useEffect } from 'react';
import { Build, BuildStatus } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { BuildCard } from '../components/builds/BuildCard';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { BUILD_CATEGORIES } from '../config/constants';
import { Plus, Search, Layers, RotateCcw } from 'lucide-react';

interface BuildsDirectoryPageProps {
  onOpenCreateBuild: () => void;
  onOpenAuth: () => void;
}

export const BuildsDirectoryPage: React.FC<BuildsDirectoryPageProps> = ({
  onOpenCreateBuild,
  onOpenAuth
}) => {
  const { profile, isAuthenticated } = useAuth();
  const { searchParams } = useRouter();

  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const [selectedStatus, setSelectedStatus] = useState<BuildStatus | ''>('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const list = await dataService.getBuilds({
          category: selectedCategory || undefined,
          status: (selectedStatus as BuildStatus) || undefined,
          currentUserId: profile?.id
        });
        if (isMounted) setBuilds(list);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedStatus, profile]);

  const filteredBuilds = builds.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.summary.toLowerCase().includes(q) ||
      b.technologies.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="page-container" style={{ paddingTop: '36px', paddingBottom: '96px', maxWidth: '900px' }}>
      {/* Title & Start Build CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: 'var(--accent-primary-muted)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={18} />
            </div>
            <span className="meta-label">Software Registry</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Projects & Builds
          </h1>
          <p className="subtext" style={{ fontSize: '15px' }}>
            Explore persistent software systems, architectures, and open repositories published on Forge.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus size={15} />}
          onClick={isAuthenticated ? onOpenCreateBuild : onOpenAuth}
        >
          Start a Build
        </Button>
      </div>

      {/* Filter Card */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f8fafc',
            padding: '7px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            flex: '1 1 240px'
          }}
        >
          <Search size={14} color="var(--text-tertiary)" />
          <input
            type="text"
            placeholder="Search by keyword, stack, or problem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', fontSize: '13px', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-base"
          style={{ width: 'auto', flex: '0 1 180px', padding: '7px 12px', fontSize: '12.5px' }}
        >
          <option value="">All Categories</option>
          {BUILD_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="input-base"
          style={{ width: 'auto', flex: '0 1 150px', padding: '7px 12px', fontSize: '12.5px' }}
        >
          <option value="">All Statuses</option>
          <option value="SHIPPED">Shipped</option>
          <option value="BETA">In Beta</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IDEA">Concept</option>
        </select>

        {(selectedCategory || selectedStatus || search) && (
          <button
            onClick={() => {
              setSelectedCategory('');
              setSelectedStatus('');
              setSearch('');
            }}
            className="btn btn-ghost btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--accent-primary)' }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Stream of Builds */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Skeleton height={120} />
          <Skeleton height={120} />
          <Skeleton height={120} />
        </div>
      ) : filteredBuilds.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '56px 24px',
            textAlign: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: 'var(--accent-primary-muted)',
              color: 'var(--accent-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}
          >
            <Layers size={20} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            No projects matched your criteria
          </h3>
          <p className="subtext">
            Try adjusting your search terms or clearing the status/category filter.
          </p>
        </div>
      ) : (
        <div>
          {filteredBuilds.map((b) => (
            <BuildCard key={b.id} build={b} />
          ))}
        </div>
      )}
    </div>
  );
};
