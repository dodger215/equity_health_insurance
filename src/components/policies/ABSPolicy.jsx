import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function ABSPolicy({ updateFormData }) {
  const handleChange = (e) => {
    updateFormData("policies", { abs: { [e.target.name]: e.target.value } })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="absType">ABS Type</Label>
        <Select onValueChange={(value) => updateFormData("policies", { abs: { type: value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select ABS Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="group">Group</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="absCoverage">Coverage Amount (GHS)</Label>
        <Input type="number" id="absCoverage" name="coverage" onChange={handleChange} min="0" step="0.01" />
      </div>
      <div>
        <Label htmlFor="absDeductible">Deductible Amount (GHS)</Label>
        <Input type="number" id="absDeductible" name="deductible" onChange={handleChange} min="0" step="0.01" />
      </div>
    </div>
  )
}

