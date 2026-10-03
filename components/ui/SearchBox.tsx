export default function SearchBox() {
  return (
    <form action="/search" className="flex-1 md:max-w-md">
      <input name="q" type="search" placeholder="ค้นหาตัวละคร สกิล Ability ด่าน" className="input" aria-label="ค้นหา" />
    </form>
  );
}
