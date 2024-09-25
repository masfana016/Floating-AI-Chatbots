import FloatingChat4 from "../components/floatingChat4";




export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
      <h1 className="text-white text-3xl text-center pt-10">Welcome to the Website!</h1>
      {/* Other content can go here */}
      
      {/* Floating Chat Widget */}
      <FloatingChat4/>
    </div>
  );
}