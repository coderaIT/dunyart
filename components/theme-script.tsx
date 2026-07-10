// Runs before paint to apply the saved theme and avoid a flash.
// Dark is the default, so we only set the attribute when "light" is stored.
const script = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
