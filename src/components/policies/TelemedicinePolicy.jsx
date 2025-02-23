import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function TelemedicinePolicy({ updateFormData }) {
  const handleChange = (e) => {
    updateFormData("policies", { telemedicine: { [e.target.name]: e.target.value } })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="teleMedProvider">Preferred Telemedicine Provider</Label>
        <Input type="text" id="teleMedProvider" name="provider" onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="teleMedConsultations">Number of Consultations</Label>
        <Input type="number" id="teleMedConsultations" name="consultations" onChange={handleChange} min="1" />
      </div>
      <div>
        <Label htmlFor="teleMedSpecialties">Preferred Specialties</Label>
        <Select onValueChange={(value) => updateFormData("policies", { telemedicine: { specialties: value } })}>
          <SelectTrigger className="form-select">
            <SelectValue placeholder="Select specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="generalPractice">General Practice</SelectItem>
            <SelectItem value="pediatrics">Pediatrics</SelectItem>
            <SelectItem value="dermatology">Dermatology</SelectItem>
            <SelectItem value="mentalHealth">Mental Health</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

