import { useEffect } from 'react'

export function UtterancesComments () {
  useEffect(() => {
    
    const scriptParentNode = document.getElementById('comments');
    if (!scriptParentNode) return;
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
		script.setAttribute('issue-term', 'pathname');
    script.setAttribute('repo', 'joaovitorJS/desafio05-criando-projeto-do-zero');
		script.setAttribute('label', 'comment :speech_balloon:');
    script.setAttribute('theme', "photon-dark");
		script.setAttribute('crossorigin', 'anonymous');
    scriptParentNode.appendChild(script);

		return () => {
			// cleanup - remove the older script with previous theme
			scriptParentNode.removeChild(scriptParentNode.firstChild);
		};
  }, []);
  return (
    <div
      id="comments"
    />
  )
}
