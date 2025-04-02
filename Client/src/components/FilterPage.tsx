import { useRestaurantStore } from "../store/useRestaurantStore";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export type FilterOptionsState = {
  id: string;
  label: string;
};

const filterOptions: FilterOptionsState[] = [
  { id: "burger", label: "Burger" },
  { id: "thali", label: "Thali" },
  { id: "biryani", label: "Biryani" },
  { id: "momos", label: "Momos" },
];

const FilterPage = () => {
  const { setAppliedFilters, appliedFilters, resetFilters } = useRestaurantStore();

  const handleFilterToggle = (filterLabel: string) => {
    const newFilters = appliedFilters.includes(filterLabel)
      ? appliedFilters.filter(f => f !== filterLabel) // Remove if already exists
      : [...appliedFilters, filterLabel]; // Add if not exists
    setAppliedFilters(newFilters);
  };

  return (
    <div className="md:w-72">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg">Filter by cuisines</h1>
        <Button 
          variant="link" 
          onClick={resetFilters}
          disabled={appliedFilters.length === 0}
        >
          Reset
        </Button>
      </div>
      {filterOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-2 my-5">
          <Checkbox
            id={option.id}
            checked={appliedFilters.includes(option.label)}
            onCheckedChange={() => handleFilterToggle(option.label)}
          />
          <Label 
            htmlFor={option.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default FilterPage;