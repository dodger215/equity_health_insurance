import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function ClientInformation({ updateFormData }) {
  const handleChange = (e) => {
    updateFormData("clientInfo", { [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-xl font-semibold">Client Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input type="text" id="lastName" className="form-control" name="lastName" onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input type="date" id="dob" className="form-control" name="dob" onChange={handleChange} required />
        </div>
        <div>
          <Label>Gender</Label>
          <div className="mode">
            <label className="label">
              <input type="radio" className="form-radio" name="gender" value="Male" onChange={handleChange} />
              <span className="ml-2">Male</span>
            </label>
            <label className="label">
              <input type="radio" className="form-radio" name="gender" value="Female" onChange={handleChange} />
              <span className="ml-2">Female</span>
            </label>
            <label className="label">
              <input type="radio" className="form-radio" name="gender" value="Other" onChange={handleChange} />
              <span className="ml-2">Other</span>
            </label>
          </div>
        </div>
        <div sty>
          <Label>ID Type</Label>
          <div className="mode">
            <label className="label">
              <input type="radio" className="form-radio" name="idType" value="Passport" onChange={handleChange} />
              <span className="ml-2">Passport</span>
            </label>
            <label className="label">
              <input
                type="radio"
                className="form-radio"
                name="idType"
                value="Driver's License"
                onChange={handleChange}
              />
              <span className="">Driver's License</span>
            </label>
            <label className="label">
              <input type="radio" className="form-radio" name="idType" value="National ID" onChange={handleChange} />
              <span className="">National ID</span>
            </label>
            <label className="label">
              <input type="radio" className="form-radio" name="idType" value="Ghana Card" onChange={handleChange} />
              <span className="">Ghana Card</span>
            </label>
            <label className="label">
              <input type="radio" className="form-radio" name="idType" value="Other" onChange={handleChange} />
              <span className="">Other</span>
            </label>
          </div>
        </div>
        <div>
          <Label htmlFor="idNumber">ID Number</Label>
          <Input type="text" id="idNumber" className="form-control" name="idNumber" onChange={handleChange} required />
        </div>
      </div>
    </div>
  )
}

