import type { Lp } from "../../types/lp";
import { useNavigate } from "react-router-dom";
import LpCardSkeleton from "./LpCardSkeleton";
interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative aspect-square rounded-md bg-[#121212] overflow-hidden border border-gray-900 shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/lp/${lp.id}`)}
    >
      <img
        src={
          lp.thumbnail
            ? `http://localhost:3000${lp.thumbnail}`
            : `https://picsum.photos/200?random=${lp.id}`
        }
        alt={lp.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://picsum.photos/200?random=${lp.id}`;
        }}
      />
      <div className="absolute inset-0 bg-black/70 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
        <h3 className="font-bold text-sm text-white line-clamp-2 mb-1">
          {lp.title}
        </h3>

        <div className="flex justify-between items-center w-full mt-1">
          <span className="text-[11px] text-gray-400">
            {lp.createdAt ? new Date(lp.createdAt).toLocaleDateString() : ""}
          </span>

          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            ♡ {lp.likes?.length ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LpCard;
