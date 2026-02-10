import { FileText, Send, CheckCircle2, Check } from "lucide-react"

const steps = [
    { icon: FileText, label: "填写信息" },
    { icon: Send, label: "确认交易" },
    { icon: CheckCircle2, label: "部署完成" },
]

interface StepIndicatorProps {
    currentStep: number
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <div className="flex items-center gap-2 w-full max-w-md">
            {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isDone = index < currentStep
                return (
                    <div key={step.label} className="flex items-center flex-1">
                        <div className="flex flex-col items-center gap-1 flex-1">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                                    isDone
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : isActive
                                          ? "border-primary text-primary"
                                          : "border-muted text-muted-foreground"
                                }`}
                            >
                                {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <span
                                className={`text-xs font-medium ${
                                    isDone || isActive ? "text-foreground" : "text-muted-foreground"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`h-0.5 flex-1 mx-2 mb-5 transition-all ${
                                    index < currentStep ? "bg-primary" : "bg-muted"
                                }`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
