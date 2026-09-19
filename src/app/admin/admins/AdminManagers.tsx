"use client";

import { useActionState, useState } from "react";
import { addAdmin, removeAdmin, resetAdminPassword, type AdminFormState } from "./actions";

export type AdminListRow = {
  id: string;
  roll_number: string;
  full_name: string | null;
  created_at: string | null;
};

const blank: AdminFormState = { error: null, ok: null };
const input =
  "w-full rounded-2xl bg-ink/60 border border-cream/15 focus:border-gold px-5 py-3 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors";

function Notice({ state }: { state: AdminFormState }) {
  if (state.error)
    return <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm text-red-200">{state.error}</p>;
  if (state.ok)
    return <p role="status" className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-200">{state.ok}</p>;
  return null;
}

function ResetForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(resetAdminPassword, blank);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-gold/80 hover:text-gold underline underline-offset-4"
      >
        {open ? "cancel" : "reset password"}
      </button>
      {open && (
        <form action={action} className="mt-2 flex items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <input name="password" placeholder="New DDMMYYYY" inputMode="numeric"
            className="w-36 rounded-xl bg-ink/60 border border-cream/15 focus:border-gold px-3 py-2 text-sm text-cream placeholder:text-cream/30 outline-none" />
          <button type="submit" disabled={pending}
            className="px-4 py-2 rounded-xl bg-gold text-ink text-xs font-bold hover:brightness-110 disabled:opacity-60">
            {pending ? "…" : "Set"}
          </button>
          {state.error && <span className="text-xs text-red-300">{state.error}</span>}
          {state.ok && <span className="text-xs text-emerald-300">{state.ok}</span>}
        </form>
      )}
    </div>
  );
}

export default function AdminManagers({ admins, selfId }: { admins: AdminListRow[]; selfId: string }) {
  const [addState, addAction, addPending] = useActionState(addAdmin, blank);
  const [rmState, rmAction] = useActionState(removeAdmin, blank);

  return (
    <div className="space-y-8">
      {/* add */}
      <section className="rounded-3xl border border-cream/10 bg-coal/60 p-6 md:p-8">
        <p className="text-gold tracking-[0.3em] uppercase text-[11px] font-semibold mb-2">New admin</p>
        <h2 className="font-display text-2xl mb-6">Add an admin</h2>
        <form action={addAction} className="grid sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-cream/50 mb-2">Roll number</label>
            <input name="roll" placeholder="e.g. 25619032" inputMode="numeric" className={input} />
          </div>
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-cream/50 mb-2">Full name</label>
            <input name="name" placeholder="Full name" className={input} />
          </div>
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-cream/50 mb-2">Password · DOB</label>
            <input name="password" placeholder="DDMMYYYY" inputMode="numeric" className={input} />
          </div>
          <button type="submit" disabled={addPending} className="btn-gold py-3 text-sm disabled:opacity-60">
            {addPending ? "Adding…" : "Add admin"}
          </button>
        </form>
        <div className="mt-4"><Notice state={addState} /></div>
      </section>

      {/* list */}
      <section className="rounded-3xl border border-cream/10 bg-coal/60 p-6 md:p-8">
        <p className="text-gold tracking-[0.3em] uppercase text-[11px] font-semibold mb-2">Current admins</p>
        <h2 className="font-display text-2xl mb-6">Who holds the keys <span className="text-gold/70 text-xl">· {admins.length}</span></h2>
        <div className="overflow-x-auto rounded-2xl border border-cream/10">
          <table className="w-full text-sm min-w-[560px]">
            <thead><tr>
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.18em] uppercase text-gold/70 font-semibold bg-ink/60">Roll number</th>
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.18em] uppercase text-gold/70 font-semibold bg-ink/60">Name</th>
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.18em] uppercase text-gold/70 font-semibold bg-ink/60">Actions</th>
            </tr></thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 text-cream/80 border-t border-cream/8">
                    <span className="font-medium text-cream">{a.roll_number}</span>
                    {a.id === selfId && <span className="ml-2 text-xs text-gold/70">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-cream/80 border-t border-cream/8">{a.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-cream/80 border-t border-cream/8">
                    <ResetForm id={a.id} />
                    {a.id !== selfId && (
                      <form action={rmAction} className="mt-1">
                        <input type="hidden" name="id" value={a.id} />
                        <button type="submit" className="text-xs text-red-300/80 hover:text-red-300 underline underline-offset-4">
                          remove admin
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4"><Notice state={rmState} /></div>
        <p className="mt-4 text-xs text-cream/40">
          Passwords are the admin&apos;s date of birth in DDMMYYYY format. Tell new admins to change theirs after first login.
        </p>
      </section>
    </div>
  );
}
