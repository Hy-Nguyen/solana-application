import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";

import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <>
      <AuroraBackground>
        <Card className="min-w-[50%]">
          <CardHeader className="justify-center">
            <div className="text-xl text-white py-10">
              Welcome Back
            </div>
          </CardHeader>
          <CardBody>
            <form className="flex flex-col space-y-3">
              <Input
                type="email"
                label={
                  <div className=" flex flex-row">
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    E-Mail
                  </div>
                }
                labelPlacement="outside"
              />
            </form>
          </CardBody>
        </Card>
      </AuroraBackground>
    </>
  );
}
