const GroupTag = ({ role }: { role: string }) => {
  if (role === "owner")
    return (
      <span className="chatapp-group-tag bg-purple-300 dark:bg-purple-700">
        owner
      </span>
    );

  if (role === "admin")
    return (
      <span className="chatapp-group-tag bg-blue-300 dark:bg-blue-800">
        admin
      </span>
    );

  return;
};

export default GroupTag;
