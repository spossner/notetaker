import { signIn, signOut, useSession } from "next-auth/react";

export const Header = () => {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  const name: string | null = sessionData?.user?.name ?? null;

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 pl-5 text-3xl font-bold">
        {name ? `Notes for ${name}` : ""}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown">
          {user ? (
            <label
              tabIndex={0}
              className="btn-ghost btn-circle avatar btn"
              onClick={() => void signOut()}
            >
              <div className="w-10 rounded-full">
                <img src={user?.image ?? ""} alt={user?.name ?? ""} />
              </div>
            </label>
          ) : (
            <button
              className="btn-ghost btn-circle btn"
              onClick={() => void signIn()}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
