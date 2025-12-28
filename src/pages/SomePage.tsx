import ImageHolder from "@/components/UI/ImageHolder";
import { UserX } from "lucide-react";

const SomePage = () => {
  const username = "John Doe";
  const isOnline = true;

  let avatarUrl = "https://avatar.iran.liara.run/public";

  // avatarUrl = "";
  return (
    <>
      <h1 className="text-2xl font-bold">Some Experiments</h1>
      <p>This page is for testing and experimenting with new features.</p>
      <p>Feel free to explore and modify the content here.</p>
    </>
  );
};

export default SomePage;
