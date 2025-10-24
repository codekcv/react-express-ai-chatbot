import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      });
  }, []);

  return (
    <main className="p-4">
      <p className="font-bold text-3xl">{message}</p>
      <Button>Button</Button>
    </main>
  );
}

export default App;
