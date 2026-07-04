import React, { useId } from "react";
import { Menu, Bell, Search, Plus } from "lucide-react";
import { useAppSelector } from "@/store";
import toast from "react-hot-toast";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const searchInputId = useId();
  const { user } = useAppSelector((state) => state.auth);
  const { items: notifications } = useAppSelector((state) => state.notifications);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleAddTransactionClick = () => {
    toast.success("Yeni işlem ekleme formu yakında aktif edilecektir!");
  };

  const displayName = user?.name || "Alex";

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-280px)] h-16 bg-surface dark:bg-slate-900 border-b border-outline-variant shadow-sm z-40 flex justify-between items-center px-gutter transition-colors duration-250">
      {/* Sol: Mobil Menü Butonu & Sayfa Başlığı (Başlık mobilde başlığın üstünde de kalabilir ama Topbar'da yer alması temizdir) */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low lg:hidden transition-colors cursor-pointer"
          aria-label="Menüyü aç"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar (Tetikleyici / Input) */}
        <div className="hidden sm:block flex-1 max-w-md text-left">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none select-none text-slate-400">
              <Search size={16} />
            </span>
            <label htmlFor={searchInputId} className="sr-only">
              İşlem, hedef veya ayar arayın
            </label>
            <input
              id={searchInputId}
              type="text"
              placeholder="Search transactions, goals, or settings..."
              className="w-full bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant rounded-full py-1.5 pl-10 pr-4 font-body-sm text-body-sm text-on-surface dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
            />
          </div>
        </div>
      </div>

      {/* Sağ Eylemler */}
      <div className="flex items-center gap-4">
        {/* Hızlı İşlem Ekleme Butonu */}
        <button
          onClick={handleAddTransactionClick}
          className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm cursor-pointer select-none"
        >
          <Plus size={16} />
          <span className="hidden xs:inline">Add Transaction</span>
        </button>

        <div className="w-px h-6 bg-outline-variant mx-2 hidden xs:block"></div>

        {/* Bildirim Zili */}
        <button className="text-on-surface-variant dark:text-slate-450 hover:text-primary transition-colors relative cursor-pointer p-1">
          <Bell size={20} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          )}
        </button>

        {/* Profil Resmi */}
        <button className="ml-2 w-9 h-9 rounded-full overflow-hidden border border-outline-variant hover:ring-2 hover:ring-primary-fixed-dim transition-all cursor-pointer">
          <img
            alt={`${displayName} profil resmi`}
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6o63vWWiHjqKu19Ne71Fd3fAEqtorM-hrk4ntmjT_HZUCQLpQhx_KYW9gbMmK0rYckKjPeRqtYDh0VDh2vPMclVS177LeFqQ87S7Gt51LZ8jM2D3pyTsyFSKZ3TxGPWy10-PuxJ9oHVVmibsvbbOrM99So-nFxoJ8CLE2wLXqs5imI9h8u2bgLWxForTFjDLoO3JIXCD_s0Akvugp6LYcvfy86pcjC9mRCYNBRUMwh0qIUzIxTm4zkHhqRUU2vyoA3KEbyO_SgWOX"
          />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
