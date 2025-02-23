import { MicroPolicy } from "./policies/MicroPolicy"
import { TelemedicinePolicy } from "./policies/TelemedicinePolicy"
import { ABSPolicy } from "./policies/ABSPolicy"
import { EbusuaPolicy } from "./policies/EbusuaPolicy"
import { DaakyePolicy } from "./policies/DaakyePolicy"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"


export function PolicySelection({ updateFormData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Policy Selection</h2>
      <Accordion type="single" collapsible >
        <AccordionItem value="micro">
          <AccordionTrigger className="select">MICRO</AccordionTrigger>
          <AccordionContent>
            <MicroPolicy updateFormData={updateFormData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="telemedicine">
          <AccordionTrigger className="select">TELEMEDICINE</AccordionTrigger>
          <AccordionContent>
            <TelemedicinePolicy updateFormData={updateFormData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="abs">
          <AccordionTrigger className="select">ABS</AccordionTrigger>
          <AccordionContent>
            <ABSPolicy updateFormData={updateFormData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ebusua">
          <AccordionTrigger className="select">EBUSUA</AccordionTrigger>
          <AccordionContent>
            <EbusuaPolicy updateFormData={updateFormData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="daakye">
          <AccordionTrigger className="select">DAAKYE</AccordionTrigger>
          <AccordionContent>
            <DaakyePolicy updateFormData={updateFormData} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

