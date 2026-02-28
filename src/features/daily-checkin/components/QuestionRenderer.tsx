import type { CheckinQuestion, CheckinResponseValue, SliderConfig, BodyMapConfig, CheckinOption } from '../types'
import { SliderInput, SingleSelect, MultiSelect, YesNoInput, TextInput } from './inputs'

// Spanish labels for body zones
const BODY_ZONE_LABELS: Record<string, string> = {
  shoulder_left: 'Hombro izquierdo',
  shoulder_right: 'Hombro derecho',
  elbow_left: 'Codo izquierdo',
  elbow_right: 'Codo derecho',
  wrist_left: 'Muñeca izquierda',
  wrist_right: 'Muñeca derecha',
  lower_back: 'Espalda baja',
  knee_left: 'Rodilla izquierda',
  knee_right: 'Rodilla derecha',
  ankle_left: 'Tobillo izquierdo',
  ankle_right: 'Tobillo derecho',
  hip_left: 'Cadera izquierda',
  hip_right: 'Cadera derecha',
}

function getBodyMapOptions(config: BodyMapConfig | undefined): CheckinOption[] {
  if (!config?.zones) return []
  return config.zones.map((zone) => ({
    value: zone,
    label: BODY_ZONE_LABELS[zone] || zone,
  }))
}

interface QuestionRendererProps {
  question: CheckinQuestion
  value: CheckinResponseValue | null
  onChange: (value: CheckinResponseValue) => void
}

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  switch (question.inputType) {
    case 'slider':
      return (
        <SliderInput
          config={question.config as SliderConfig ?? { min: 1, max: 10 }}
          value={value as number | null}
          onChange={onChange}
        />
      )

    case 'single_select':
      return (
        <SingleSelect
          options={question.options ?? []}
          value={value as string | null}
          onChange={onChange}
        />
      )

    case 'multi_select':
      return (
        <MultiSelect
          options={question.options ?? []}
          value={(value as string[]) ?? []}
          onChange={onChange}
        />
      )

    case 'yes_no':
      return (
        <YesNoInput
          value={value as string | null}
          onChange={onChange}
        />
      )

    case 'text':
      return (
        <TextInput
          value={value as string | null}
          onChange={onChange}
        />
      )

    case 'body_map':
      // Convert config.zones to selectable options
      return (
        <MultiSelect
          options={getBodyMapOptions(question.config as BodyMapConfig)}
          value={(value as string[]) ?? []}
          onChange={onChange}
        />
      )

    default:
      return (
        <p className="text-muted-foreground">
          Tipo de pregunta no soportado: {question.inputType}
        </p>
      )
  }
}
