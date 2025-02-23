import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"


export function ClientContact({ updateFormData }) {
  const handleChange = (e) => {
    updateFormData("clientContact", { [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-xl font-semibold">Client Contact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input type="number" className="form-control" id="phoneNumber" name="phoneNumber" onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input type="email" id="email" className="form-control" name="email" onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="nationality">Nationality</Label>
          <Input type="text" id="nationality" className="form-control"  name="nationality" onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input type="text" id="country" className="form-control"  name="country" onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="city">City/Town</Label>
          <Input type="text" id="city" className="form-control"  name="city" onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Residential Address</Label>
        <Textarea id="address" className="form-control" name="address" onChange={handleChange} required />
      </div>
    </div>
  )
}

