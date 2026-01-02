import {useEffect, useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {base} from "@/lib/network/base";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";

type Role = {
  id_role: number;
  nama_role: string;
};

export default function AssignRoleForm({
  idUser,
  currentRoles = [],
  onSuccess,
}: {
  idUser: string;
  currentRoles?: Role[];
  onSuccess?: () => void;
}) {
  const {toast} = useToast();
  const queryClient = useQueryClient();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const {data: roles, isLoading} = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await base.get("/get_roles");
      return res.data.data ?? res.data;
    },
  });

  useEffect(() => {
    if (currentRoles?.length) {
      setSelectedRoles(currentRoles.map((r) => String(r.id_role)));
    }
  }, [currentRoles]);

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async () => {
    try {
      await base.post(
        "/assign_role",
        {id_user: idUser, id_role: selectedRoles},
        {headers: {"Content-Type": "application/json"}}
      );
      toast({
        title: "Berhasil",
        description: "Role berhasil diperbarui.",
      });
      queryClient.invalidateQueries({queryKey: ["data-users"]});
      if (onSuccess) onSuccess();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Role gagal diperbarui.",
      });
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <p>Loading role...</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border p-2 rounded">
          {roles?.map((role: Role) => (
            <label key={role.id_role} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={role.id_role}
                checked={selectedRoles.includes(String(role.id_role))}
                onChange={() => toggleRole(String(role.id_role))}
              />
              {role.nama_role}
            </label>
          ))}
        </div>
      )}
      <Button onClick={handleSubmit} disabled={!selectedRoles.length}>
        Simpan
      </Button>
    </div>
  );
}
