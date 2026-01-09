import { useNavigate } from "react-router-dom";

const CreatorCard = ({ creator }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/creator/${creator.id}`)}
      className="cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl
                 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)]
                 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative">
        <img
          src={creator.image}
          alt={creator.name}
          className="h-56 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white
                        border border-white/15 bg-white/10 backdrop-blur">
          {creator.category}
        </div>
      </div>

      <div className="p-5 text-left">
        <h3 className="font-semibold text-lg text-white">{creator.name}</h3>
        <p className="text-sm text-gray-300">{creator.location}</p>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-300">
            ⭐ {creator.rating} • {creator.followers}
          </span>
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-pink-300">
            ${creator.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;