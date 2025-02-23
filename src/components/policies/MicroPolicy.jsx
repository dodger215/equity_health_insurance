import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

export function MicroPolicy({ updateFormData }) {
  const handleChange = (e) => {
    updateFormData("policies", { micro: { [e.target.name]: e.target.value } })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="microCoverage">Coverage Amount (GHS)</Label>
        <Input type="number" id="microCoverage" name="coverage" onChange={handleChange} min="0" step="0.01" />
      </div>
      <div>
        <Label htmlFor="microDuration">Policy Duration (months)</Label>
        <Input type="number" id="microDuration" name="duration" onChange={handleChange} min="1" max="12" />
      </div>
      <div>
        <Label htmlFor="microBenefits">Benefits</Label>
        <Textarea id="microBenefits" name="benefits" onChange={handleChange} />
      </div>
    </div>
  )
}

