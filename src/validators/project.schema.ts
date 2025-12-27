import { z } from "zod";

export const projectSchema = z.object({
	// Informasi Dasar
	contract_basis: z.string().optional(),
	contract_code: z.string().min(1, "Nomor Kontrak wajib diisi"),
	contract_date: z.date({ error: "Tanggal Kontrak wajib diisi" }),
	end_date: z.date({ error: "Deadline wajib diisi" }), // Used as deadline in Info Dasar
	notes: z.string().optional(),

	// Administrasi Project
	name: z.string().min(1, "Nama Project wajib diisi"),
	client_id: z.string({ error: "Klien wajib dipilih" }),
	pmo_id: z.string({ error: "Project Manager wajib dipilih" }),

	// Updated budget validation to handle "Rp 1.000.000" format
	budget: z.coerce
		.number({ error: "Budget wajib diisi" })
		.min(0, "Budget wajib diisi"),

	start_date: z.date({ error: "Tanggal Mulai wajib diisi" }),
	// end_date is reused here

	// Scope of Work
	scopes: z.array(z.string()).min(1, "Pilih setidaknya satu modul"),

	// Team Assignment (Dynamic based on scopes)
	// We will map this to `members` array for backend
	team_assignments: z.record(
		z.string(),
		z.object({
			leader_id: z.string().min(1, "Leader wajib dipilih"),
			member_id: z.string().min(1, "Member wajib dipilih"),
		}),
	),

	// SLA & Reminders
	due_policy_days: z.coerce.number().min(0, "Due Policy wajib diisi"),
	escalation_user_ids: z.array(z.string()).optional(),

	// Deliverables
	bast_template_id: z.string().optional(),
	invoice_template_id: z.string().optional(),
}).superRefine((data, ctx) => {
    // Validate dates
    if (data.start_date && data.end_date) {
        if (data.end_date < data.start_date) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Deadline tidak boleh lebih awal dari Tanggal Mulai",
                path: ["end_date"],
            });
        }
    }

    const { scopes, team_assignments } = data;
    if (!scopes || scopes.length === 0) return;

    scopes.forEach((scope) => {
        const sanitizedKey = scope.replace(/[\s.]/g, '_');
        const assignment = team_assignments?.[sanitizedKey];

        if (!assignment || !assignment.leader_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Team Leader untuk modul ${scope} wajib dipilih`,
                path: ["team_assignments", sanitizedKey, "leader_id"],
            });
        }
        if (!assignment || !assignment.member_id) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Team Member untuk modul ${scope} wajib dipilih`,
                path: ["team_assignments", sanitizedKey, "member_id"],
            });
        }
    });
});

export type ProjectFormInputValues = z.input<typeof projectSchema>;
export type ProjectFormValues = z.output<typeof projectSchema>;
