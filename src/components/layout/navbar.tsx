import AuthButton from "../user/user-button";
import Link from "next/link";

function BlurHeader() {
  return (
    <header className="sticky top-0 z-20 mx-auto flex w-full items-center justify-between p-5  sm:px-10">
      <div className="pointer-events-none absolute inset-0  z-[5] h-[20vh] backdrop-blur-[1px] [mask-image:linear-gradient(0deg,transparent_50%,#000_62.5%,#000_75%,transparent_87.5%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[6] h-[20vh] backdrop-blur-[2px] [mask-image:linear-gradient(0deg,transparent_62.5%,#000_75%,#000_87.5%,transparent_100%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[7] h-[20vh] backdrop-blur-[4px] [mask-image:linear-gradient(0deg,transparent_75%,#000_87.5%,#000_100%,transparent_112.5%)]"></div>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link className="z-[10]" href="/">
          CashClips
        </Link>
        <div className="z-[10]">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

export function Header() {
  return (
    <>
      <BlurHeader />
    </>
  );
}
