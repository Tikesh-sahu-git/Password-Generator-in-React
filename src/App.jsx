import PasswordGenerator from "./components/PasswordGenerator";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <PasswordGenerator />
      </div>
    </div>
  );
};

export default App;
