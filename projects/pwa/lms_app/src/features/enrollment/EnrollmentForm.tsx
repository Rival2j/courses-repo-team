import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const enrollmentSchema = z.object({
  studentName: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Ingresa un email válido"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar los términos para inscribirte" }),
  }),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  courseTitle: string;
  isEnrolled: boolean;
  canEnroll: boolean;
  blockedReasons: string[];
  isOffline: boolean;
  onEnroll: () => void;
}

export default function EnrollmentForm({
  courseTitle,
  isEnrolled,
  canEnroll,
  blockedReasons,
  isOffline,
  onEnroll,
}: EnrollmentFormProps) {
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentName: "",
      email: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: EnrollmentFormValues) => {
    onEnroll();
    setSuccessMessage(
      `Te has inscrito en "${courseTitle}". Podrás avanzar en la ruta de aprendizaje y desbloquear lecciones.`
    );
    reset();
  };

  if (isEnrolled) {
    return (
      <section className="enrollment-panel" aria-labelledby="enrollment-heading">
        <h3 id="enrollment-heading">Inscripción</h3>
        <p>Ya estás inscrito en este curso. Continúa con las lecciones disponibles y revisa tu progreso.</p>
      </section>
    );
  }

  return (
    <section className="enrollment-panel" aria-labelledby="enrollment-heading">
      <h3 id="enrollment-heading">Inscripción rápida</h3>
      <p>Completa el formulario para validar el flujo de ingreso y los límites de interacción.</p>

      {blockedReasons.length > 0 ? (
        <div className="status-banner status-banner-blocked">
          <strong>Inscripción bloqueada.</strong> Completa primero los siguientes cursos:
          <ul>
            {blockedReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {isOffline ? (
        <div className="status-banner status-banner-offline">
          La inscripción está bloqueada mientras estás offline. Reconéctate para completar el registro.
        </div>
      ) : null}

      <form className="enrollment-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="form-label">
          Nombre completo
          <input className="form-input" type="text" {...register("studentName")} />
          {errors.studentName && <span className="form-error">{errors.studentName.message}</span>}
        </label>

        <label className="form-label">
          Correo electrónico
          <input className="form-input" type="email" {...register("email")} />
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </label>

        <label className="form-checkbox">
          <input type="checkbox" {...register("acceptTerms")} />
          Acepto los términos y condiciones de inscripción
        </label>
        {errors.acceptTerms && <span className="form-error">{errors.acceptTerms.message}</span>}

        <button className="button button-primary" type="submit" disabled={isSubmitting || !canEnroll || isOffline}>
          {canEnroll && !isOffline ? "Solicitar inscripción" : "Inscripción no disponible"}
        </button>

        {successMessage ? <p className="form-success">{successMessage}</p> : null}
      </form>
    </section>
  );
}
