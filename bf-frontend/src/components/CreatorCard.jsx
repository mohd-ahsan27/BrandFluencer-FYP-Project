import { useNavigate } from "react-router-dom";

const CreatorCard = ({ creator }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/creator/${creator.id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
    >
      <img
        src={creator.image}
        alt={creator.name}
        className="h-56 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{creator.name}</h3>
        <p className="text-sm text-gray-500">{creator.category}</p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-600">
            {creator.location}
          </span>
          <span className="font-semibold">${creator.price}</span>
        </div>

        <div className="flex justify-between mt-2 text-sm">
          <span>⭐ {creator.rating}</span>
          <span>{creator.followers}</span>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
