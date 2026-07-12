import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchActivities } from "@/features/activity/activitySlice";
import type { ActivityLog } from "@/features/activity/activitySlice";
import DataTable from "@/components/display/DataTable";
import type { Column } from "@/components/display/DataTable";
import { formatDistanceToNow, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import * as Icons from "lucide-react";
import ErrorState from "@/components/feedback/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "LogIn":
      return <Icons.LogIn size={16} className="text-emerald-500" />;
    case "LogOut":
      return <Icons.LogOut size={16} className="text-orange-500" />;
    case "UserPlus":
      return <Icons.UserPlus size={16} className="text-blue-500" />;
    case "PlusCircle":
      return <Icons.PlusCircle size={16} className="text-emerald-500" />;
    case "Edit2":
      return <Icons.Edit2 size={16} className="text-blue-500" />;
    case "Trash2":
      return <Icons.Trash2 size={16} className="text-red-500" />;
    case "Sliders":
      return <Icons.Sliders size={16} className="text-indigo-500" />;
    case "Award":
      return <Icons.Award size={16} className="text-amber-500" />;
    case "CreditCard":
      return <Icons.CreditCard size={16} className="text-purple-500" />;
    case "Settings":
      return <Icons.Settings size={16} className="text-slate-500" />;
    case "Palette":
      return <Icons.Palette size={16} className="text-pink-500" />;
    default:
      return <Icons.Activity size={16} className="text-slate-400" />;
  }
};

const getStatusBadge = (status: ActivityLog["status"]) => {
  switch (status) {
    case "success":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-500/10 dark:text-emerald-450">
          Success
        </span>
      );
    case "warning":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-orange-500 bg-orange-500/10 dark:text-orange-450">
          Warning
        </span>
      );
    case "error":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-red-650 bg-red-500/10 dark:text-red-400">
          Error
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-500/10 dark:text-blue-400">
          Info
        </span>
      );
  }
};

const formatTimeAgo = (timestampStr: string) => {
  try {
    const date = parseISO(timestampStr);
    return formatDistanceToNow(date, { addSuffix: true, locale: tr });
  } catch {
    return "bilinmeyen zaman";
  }
};

export const ActivityLogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    logs = [],
    loading = false,
    error = null,
  } = useAppSelector((state) => state.activity || {});

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchActivities());
  };

  const filteredLogs = useMemo(() => {
    if (!Array.isArray(logs)) return [];
    return logs.filter((log) => {
      if (!log) return false;
      const matchesSearch =
        (log.action || "").toLowerCase().includes(search.toLowerCase()) ||
        (log.description || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        (log.category || "").toLowerCase() === categoryFilter.toLowerCase();

      let matchesDate = true;
      if (dateFilter === "Today") {
        const today = new Date().toISOString().split("T")[0];
        matchesDate = log.date === today;
      } else if (dateFilter === "Yesterday") {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        matchesDate = log.date === yesterday;
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [logs, search, categoryFilter, dateFilter]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const columns: Column<ActivityLog>[] = [
    {
      key: "icon",
      header: "",
      render: (row) => <div className="flex items-center justify-center">{getIcon(row.icon)}</div>,
      className: "w-12 text-center",
    },
    {
      key: "action",
      header: "Eylem",
      render: (row) => (
        <span className="font-bold text-xs text-slate-850 dark:text-white">{row.action}</span>
      ),
      className: "font-bold",
    },
    {
      key: "category",
      header: "Kategori",
      render: (row) => (
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {row.category}
        </span>
      ),
    },
    {
      key: "description",
      header: "Açıklama",
      render: (row) => (
        <span className="text-xs text-slate-650 dark:text-slate-350">{row.description}</span>
      ),
    },
    {
      key: "user",
      header: "Kullanıcı",
      render: (row) => (
        <span className="text-xs font-bold text-slate-750 dark:text-slate-300">{row.user}</span>
      ),
    },
    {
      key: "status",
      header: "Durum",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "timestamp",
      header: "Zaman",
      render: (row) => (
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">
          {formatTimeAgo(row.timestamp)}
        </span>
      ),
    },
  ];

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,ID,Action,Category,Description,User,Date,Time,Status\n" +
      filteredLogs
        .map(
          (e) =>
            `${e.id},${e.action},${e.category},${e.description},${e.user},${e.date},${e.time},${e.status}`,
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Activity_Logs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Aktivite logları başarıyla ihraç edildi.");
  };

  if (loading) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left space-y-8 select-none">
        <div className="space-y-2">
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <SkeletonTable columns={6} rows={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <ErrorState
          title="Aktiviteler Yüklenemedi"
          description="Sistem aktivite günlükleri mock API'den alınırken bir problem yaşandı. Lütfen tekrar deneyiniz."
          onRetry={handleRetry}
          retryLabel="Yeniden Dene"
          retryIcon={<Icons.RotateCcw size={16} />}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 select-none">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Sistem Aktivite Günlükleri
          </h2>
          <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 font-medium mt-1">
            Uygulama genelinde gerçekleşen tüm önemli finansal ve sistemsel değişikliklerin güvenli
            günlüğü.
          </p>
        </div>
        <Button
          variant="outline"
          icon={<Icons.Download size={16} />}
          onClick={handleExport}
          className="w-full sm:w-auto shrink-0 justify-center"
        >
          Günlükleri Dışa Aktar
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-soft-sm select-none">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icons.Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Loglarda ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 pr-8 text-xs font-bold text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
            >
              <option value="All">Tüm Kategoriler</option>
              <option value="Auth">Yetkilendirme</option>
              <option value="Transactions">İşlemler</option>
              <option value="Budget">Bütçe</option>
              <option value="Goals">Hedefler</option>
              <option value="Subscriptions">Abonelikler</option>
              <option value="Settings">Ayarlar</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-400 pointer-events-none" />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 pr-8 text-xs font-bold text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
            >
              <option value="All">Tüm Zamanlar</option>
              <option value="Today">Bugün</option>
              <option value="Yesterday">Dün</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedLogs}
        emptyTitle="Aktivite Bulunamadı"
        emptyDescription="Aradığınız kriterlere uygun herhangi bir sistem günlüğü kaydı bulunmamaktadır."
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4 select-none">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
            Sayfa {currentPage} / {totalPages} ({filteredLogs.length} Log)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Önceki
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogPage;
