const HomePage = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome to MovieMagic</h1>
        <p className="text-gray-600">
          Discover and book tickets for the latest movies showing in theaters near you.
        </p>
        
        {/* Content would go here */}
        <div className="p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          Content area - Movies will be displayed here
        </div>
      </div>
    );
  };
  
  export default HomePage;