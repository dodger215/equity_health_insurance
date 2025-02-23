import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"

export function DaakyePolicy({ updateFormData }) {
  const handleChange = (e) => {
    updateFormData("policies", { daakye: { [e.target.name]: e.target.value } })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="daakyePlan">Daakye Plan</Label>
        <Select onValueChange={(value) => updateFormData("policies", { daakye: { plan: value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Daakye Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="daakyeDuration">Policy Duration (years)</Label>
        <Input type="number" id="daakyeDuration" name="duration" onChange={handleChange} min="1" max="30" />
      </div>
      <div>
        <Label htmlFor="daakyePremium">Annual Premium (GHS)</Label>
        <Input type="number" id="daakyePremium" name="premium" onChange={handleChange} min="0" step="0.01" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="daakyeCriticalIllness"
          onCheckedChange={(checked) => updateFormData("policies", { daakye: { criticalIllness: checked } })}
        />
        <Label htmlFor="daakyeCriticalIllness">Include Critical Illness Coverage</Label>
      </div>
    </div>
  )
}

