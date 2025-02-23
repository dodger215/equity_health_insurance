import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"

export function EbusuaPolicy({ updateFormData }) {
  const handleChange = (e) => {
    updateFormData("policies", { ebusua: { [e.target.name]: e.target.value } })
  }

  const handleCheckboxChange = (name, checked) => {
    updateFormData("policies", { ebusua: { [name]: checked } })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ebusuaMembers">Number of Family Members</Label>
        <Input type="number" id="ebusuaMembers" name="members" onChange={handleChange} min="1" />
      </div>
      <div>
        <Label htmlFor="ebusuaCoverage">Coverage Amount per Member (GHS)</Label>
        <Input type="number" id="ebusuaCoverage" name="coverage" onChange={handleChange} min="0" step="0.01" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="ebusuaMaternity" onCheckedChange={(checked) => handleCheckboxChange("maternity", checked)} />
        <Label htmlFor="ebusuaMaternity">Include Maternity Coverage</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="ebusuaDental" onCheckedChange={(checked) => handleCheckboxChange("dental", checked)} />
        <Label htmlFor="ebusuaDental">Include Dental Coverage</Label>
      </div>
    </div>
  )
}

