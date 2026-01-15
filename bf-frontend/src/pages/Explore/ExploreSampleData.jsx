import CreatorCard from "../components/CreatorCard";
import creators from "../data/creatorSampleData";

const Explore = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-2xl font-bold mb-6">
          Explore Creators
        </h1>

        {/* Filters (UI only for now) */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["Platform", "Category", "Location", "Price", "Gender"].map(
            (item) => (
              <button
                key={item}
                className="px-4 py-2 rounded-full border bg-white text-sm hover:bg-gray-100"
              >
                {item}
              </button>
            )
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
