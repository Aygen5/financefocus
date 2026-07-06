import React, { useId, useState, useEffect, useRef } from "react";
import {
  Menu,
  Bell,
  Search,
  Plus,
  CircleUser,
  Home,
  Check,
  Trash2,
  LogIn,
  Sliders,
  CreditCard,
  Award,
  Info,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/features/notifications/notificationsSlice";
import { fetchTransactions } from "@/features/transactions/transactionsSlice";
import { fetchBudgets } from "@/features/budget/budgetSlice";
import { fetchGoals } from "@/features/goals/goalsSlice";
import { fetchSubscriptions } from "@/features/subscriptions/subscriptionsSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLayout } from "./LayoutContext";
import navigationConfig from "@/config/navigation.config";
import ROUTES from "@/constants/routes";
import toast from "react-hot-toast";
import { cn } from "@/utils/styles";
import { formatDistanceToNow, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { QuickActionModal } from "./components/QuickActionModal";
import { HelpModal } from "./components/HelpModal";

const getNotifIcon = (iconName: string, type: string) => {
  const styles = "w-4 h-4 shrink-0 mt-0.5";
  switch (iconName) {
    case "LogIn":
      return <LogIn className={cn(styles, "text-emerald-500")} />;
    case "Sliders":
      return <Sliders className={cn(styles, "text-indigo-500")} />;
    case "CreditCard":
      return <CreditCard className={cn(styles, "text-purple-500")} />;
    case "Award":
      return <Award className={cn(styles, "text-amber-500")} />;
    default:
      return type === "error" ? (
        <AlertTriangle className={cn(styles, "text-red-500")} />
      ) : (
        <Info className={cn(styles, "text-slate-400")} />
      );
  }
};

const Topbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchInputId = useId();
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleMobileOpen, isCollapsed } = useLayout();

  // States
  const { items: notifications = [] } = useAppSelector((state) => state.notifications || {});
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Search-related states and refs
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Redux Selectors for Global Search
  const transactions = useAppSelector((state) => state.transactions?.items) || [];
  const budgets = useAppSelector((state) => state.budget?.items) || [];
  const goals = useAppSelector((state) => state.goals?.items) || [];
  const subscriptions = useAppSelector((state) => state.subscriptions?.items) || [];

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
    dispatch(fetchGoals());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Shortcut keys listener
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        setIsHelpOpen(true);
      }
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setIsQuickActionOpen(true);
      }
    };
    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, []);

  // Click outside to close panels logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddTransactionClick = () => {
    setIsQuickActionOpen(true);
  };

  const handleMarkAllRead = async () => {
    await dispatch(markAllNotificationsRead());
    toast.success("Tüm bildirimler okundu işaretlendi.");
  };

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(markNotificationRead(id));
    toast.success("Bildirim okundu.");
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(deleteNotification(id));
    toast.success("Bildirim silindi.");
  };

  // Dinamik sayfa başlığı çıkarma mantığı
  const currentPath = location.pathname;
  const currentMenu = navigationConfig.find((item) => item.path === currentPath);
  const pageTitle = currentMenu ? currentMenu.label : "FinanceFocus";

  // Global Search Filtering Logic
  const query = searchQuery.toLowerCase().trim();

  // 1. Transactions süzme
  const filteredTransactions = query
    ? transactions
        .filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query)) ||
            t.category.toLowerCase().includes(query),
        )
        .slice(0, 3)
    : [];

  // 2. Budget süzme
  const filteredBudgets = query
    ? budgets
        .filter(
          (b) =>
            b.category.toLowerCase().includes(query) || b.limitAmount.toString().includes(query),
        )
        .slice(0, 3)
    : [];

  // 3. Goals süzme
  const filteredGoals = query
    ? goals
        .filter(
          (g) =>
            g.title.toLowerCase().includes(query) ||
            (g.notes && g.notes.toLowerCase().includes(query)) ||
            g.category.toLowerCase().includes(query),
        )
        .slice(0, 3)
    : [];

  // 4. Subscriptions süzme
  const filteredSubscriptions = query
    ? subscriptions
        .filter(
          (s) => s.name.toLowerCase().includes(query) || s.category.toLowerCase().includes(query),
        )
        .slice(0, 3)
    : [];

  // 5. Sayfalar / Navigasyon süzme
  const filteredPages = query
    ? navigationConfig
        .filter(
          (item) =>
            item.label.toLowerCase().includes(query) || item.path.toLowerCase().includes(query),
        )
        .slice(0, 3)
    : [];

  const hasResults =
    filteredTransactions.length > 0 ||
    filteredBudgets.length > 0 ||
    filteredGoals.length > 0 ||
    filteredSubscriptions.length > 0 ||
    filteredPages.length > 0;

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-outline-variant shadow-sm z-40 flex justify-between items-center px-6 transition-all duration-300 select-none",
        isCollapsed ? "w-full lg:w-[calc(100%-80px)]" : "w-full lg:w-[calc(100%-280px)]",
      )}
    >
      {/* Sol: Hamburger Mobil Butonu & Dinamik Sayfa Başlığı / Breadcrumb */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleMobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden transition-colors cursor-pointer"
          aria-label="Menüyü aç"
        >
          <Menu size={20} />
        </button>

        {/* Dinamik Sayfa Başlığı ve Breadcrumb */}
        <div className="hidden sm:flex flex-col text-left select-none">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            <Link
              to="/"
              className="hover:text-primary dark:hover:text-brand-400 flex items-center gap-0.5 transition-colors"
            >
              <Home size={10} />
              Ana Sayfa
            </Link>
          </nav>
          {/* Sayfa Başlığı */}
          <h2 className="text-sm font-extrabold text-slate-800 dark:text-white leading-none tracking-tight">
            {pageTitle}
          </h2>
        </div>
      </div>

      {/* Orta: Search Bar (Global Command Search) */}
      <div className="hidden md:block flex-1 max-w-xs text-left mx-4 relative" ref={searchRef}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none select-none">
            <Search size={16} />
          </span>
          <label htmlFor={searchInputId} className="sr-only">
            Arama yapın
          </label>
          <input
            id={searchInputId}
            type="text"
            placeholder="Arayın... (örn: Migros, Bütçe, Maaş)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-full py-1.5 pl-10 pr-4 font-semibold text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder-slate-400"
          />
        </div>

        {/* Global Live Search Results Dropdown */}
        {isSearchFocused && searchQuery && (
          <div className="absolute top-11 left-0 right-0 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-soft-lg z-50 overflow-hidden max-h-[380px] overflow-y-auto custom-scrollbar select-none animate-slideDown">
            {!hasResults ? (
              <div className="p-6 text-center text-xs font-bold text-slate-400 dark:text-slate-500">
                Aramanızla eşleşen sonuç bulunamadı.
              </div>
            ) : (
              <div className="py-2 divide-y divide-slate-100 dark:divide-slate-850">
                {/* 1. Sayfalar / Navigasyon */}
                {filteredPages.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      Sayfalar
                    </p>
                    {filteredPages.map((page) => (
                      <button
                        key={page.path}
                        onClick={() => {
                          navigate(page.path);
                          setSearchQuery("");
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl flex items-center gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-primary dark:text-brand-400 group-hover:scale-105 transition-transform shrink-0">
                          {React.createElement(page.icon || Home, { size: 16 })}
                        </div>
                        <div className="truncate">
                          <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold group-hover:text-primary dark:group-hover:text-brand-400 transition-colors">
                            {page.label}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 truncate">
                            Sayfaya hızlı yönlen
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. İşlemler (Transactions) */}
                {filteredTransactions.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      İşlemler
                    </p>
                    {filteredTransactions.map((tx) => (
                      <button
                        key={tx.id}
                        onClick={() => {
                          navigate("/transactions");
                          setSearchQuery("");
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl flex items-center gap-3 transition-colors cursor-pointer group"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg ${tx.transactionType === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}
                        >
                          <CreditCard size={16} />
                        </div>
                        <div className="truncate flex-1">
                          <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold truncate group-hover:text-primary dark:group-hover:text-brand-400 transition-colors">
                            {tx.title}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 truncate">
                            {tx.category} • {tx.amount.toLocaleString("tr-TR")} ₺
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Bütçeler (Budgets) */}
                {filteredBudgets.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      Bütçeler
                    </p>
                    {filteredBudgets.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          navigate("/budget");
                          setSearchQuery("");
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl flex items-center gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-105 transition-transform shrink-0">
                          <Sliders size={16} />
                        </div>
                        <div className="truncate flex-1">
                          <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold truncate group-hover:text-primary dark:group-hover:text-brand-400 transition-colors">
                            {b.category} Bütçesi
                          </p>
                          <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 truncate">
                            Limit: {b.limitAmount.toLocaleString("tr-TR")} ₺
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 4. Hedefler (Goals) */}
                {filteredGoals.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      Hedefler
                    </p>
                    {filteredGoals.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          navigate("/goals");
                          setSearchQuery("");
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl flex items-center gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform shrink-0">
                          <Award size={16} />
                        </div>
                        <div className="truncate flex-1">
                          <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold truncate group-hover:text-primary dark:group-hover:text-brand-400 transition-colors">
                            {g.title}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 truncate">
                            Hedef: {g.targetAmount.toLocaleString("tr-TR")} ₺
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 5. Abonelikler (Subscriptions) */}
                {filteredSubscriptions.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      Abonelikler
                    </p>
                    {filteredSubscriptions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          navigate("/subscriptions");
                          setSearchQuery("");
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl flex items-center gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-105 transition-transform shrink-0">
                          <Sliders size={16} />
                        </div>
                        <div className="truncate flex-1">
                          <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold truncate group-hover:text-primary dark:group-hover:text-brand-400 transition-colors">
                            {s.name} Aboneliği
                          </p>
                          <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 truncate">
                            Ücret: {s.cost.toLocaleString("tr-TR")} ₺ / aylık
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sağ Eylemler: Artı (+), Yardım (Help), Bildirimler (Bell) ve Profil (CircleUser) */}
      <div
        className="flex items-center gap-1 sm:gap-2 select-none shrink-0 relative"
        ref={panelRef}
      >
        {/* Artı (+) Butonu */}
        <button
          onClick={handleAddTransactionClick}
          className="text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-full p-1.5 sm:p-2 transition-colors duration-200 flex items-center justify-center"
          aria-label="İşlem Ekle"
        >
          <Plus size={20} />
        </button>

        {/* Yardım Butonu */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-full p-1.5 sm:p-2 transition-colors duration-200 flex items-center justify-center"
          aria-label="Yardım Paneli"
        >
          <HelpCircle size={20} />
        </button>

        {/* Bildirimler (Bell) Butonu */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-full p-1.5 sm:p-2 transition-colors duration-200 relative flex items-center justify-center"
          aria-label="Bildirimler"
        >
          <Bell size={20} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 flex items-center justify-center text-[9px] font-black text-white bg-red-600 rounded-full border border-white dark:border-slate-900 animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Notification Popover Panel */}
        {isPanelOpen && (
          <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-soft-lg z-50 text-left overflow-hidden animate-slideDown">
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                Bildirimler
              </h3>
              {unreadNotificationsCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-primary dark:text-brand-400 hover:underline cursor-pointer"
                >
                  Tümünü Okundu Yap
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-slate-400 dark:text-slate-500">
                  Yeni bildirim bulunmuyor.
                </div>
              ) : (
                notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-3.5 flex gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-850/40 relative group",
                      !notif.isRead && "bg-blue-50/20 dark:bg-blue-900/10",
                    )}
                  >
                    {getNotifIcon(notif.icon, notif.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "text-xs font-bold block",
                            notif.isRead
                              ? "text-slate-700 dark:text-slate-350"
                              : "text-slate-850 dark:text-white",
                          )}
                        >
                          {notif.title}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          {formatDistanceToNow(parseISO(notif.createdAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>

                    {/* Actions Panel */}
                    <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-900 rounded-md p-1 shadow-soft-sm">
                      {!notif.isRead && (
                        <button
                          onClick={(e) => handleMarkRead(notif.id, e)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-500 cursor-pointer"
                          title="Okundu Yap"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(notif.id, e)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-red-500 cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Panel Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center">
              <Link
                to={ROUTES.NOTIFICATIONS}
                onClick={() => setIsPanelOpen(false)}
                className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-brand-400"
              >
                Tüm Bildirimleri Görüntüle
              </Link>
            </div>
          </div>
        )}

        {/* Profil (CircleUser) Butonu */}
        <Link
          to={ROUTES.SETTINGS}
          className="text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-full p-2 transition-colors duration-200 flex items-center justify-center"
          aria-label="Profil ve Ayarlar"
        >
          <CircleUser size={22} />
        </Link>
      </div>

      {/* Real modals integration */}
      <QuickActionModal isOpen={isQuickActionOpen} onClose={() => setIsQuickActionOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </header>
  );
};

export default Topbar;
