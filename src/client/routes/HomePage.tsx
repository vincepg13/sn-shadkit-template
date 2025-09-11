import shadcnLight from "../assets/shadcn-light.png";
import shadcnDark from "../assets/shadcn-dark.png";
import tailwindLight from "../assets/tailwind-light.png";
import tailwindDark from "../assets/tailwind-dark.png";
import { CheckCircle2Icon } from "lucide-react";
import { useTheme } from "../context/theme-context";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-4 p-4">
      <Alert>
        <AlertTitle className="flex gap-2 items-center border-b pb-2 mb-1">
          <CheckCircle2Icon size={22} className="text-green-500" />
          <span className="text-xl font-semibold tracking-tight">Success! You are using React in ServiceNow</span>
          <div className="ml-auto p-1">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" className="w-8"/>
          </div>
        </AlertTitle>
        <AlertDescription className="text-base">
          You have succesfully deployed a React application to a ServiceNow UI Page via SDK 4.0 using the shadcn-kit
          template. Get started with the below resources:
          <div className="grid grid-cols-3 justify-between w-full items-center gap-4 px-2 pb-3 pt-5">
            <a className="mx-auto" href="https://ui.shadcn.com/" target="_blank">
              <img src={theme === "light" ? shadcnLight : shadcnDark} alt="Shadcn Logo" className="max-w-70" />
            </a>
            <a
              className="flex flex-col items-center"
              href="https://www.npmjs.com/package/sn-shadcn-kit"
              target="_blank"
            >
              <h1 className="text-5xl font-[700] text-foreground">sn-shadcn-kit</h1>
              <p className="text-muted-foreground">(Built for ServiceNow)</p>
            </a>
            <a className="mx-auto" href="https://tailwindcss.com/" target="_blank">
              <img src={theme === "light" ? tailwindLight : tailwindDark} alt="Tailwind Logo" className="max-w-70" />
            </a>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
