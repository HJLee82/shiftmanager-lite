type Props = {
  name: string;
  role: string;
  isEditing: boolean;
  onNameChange?: (value: string) => void;
  onRoleChange?: (value: string) => void;
};

export default function EmployeeForm({
  name,
  role,
  isEditing,
  onNameChange,
  onRoleChange,
}: Props) {
  return (
    <div className="space-y-3 flex-1">
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange?.(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-800 font-medium">{name}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
        {isEditing ? (
          <input
            type="text"
            value={role}
            onChange={(e) => onRoleChange?.(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-800">{role}</p>
        )}
      </div>
    </div>
  );
}