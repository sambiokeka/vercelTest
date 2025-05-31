document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.__cadastro-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cidade = document.getElementById('cidade').value;
            const nivelAgua = document.getElementById('nivel-agua').value;
            const pessoasAfetadas = document.getElementById('pessoas-afetadas').value;
            const data = document.getElementById('data').value;
            
            function validarCidade(cidade) {
                const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/;
                return regex.test(cidade) && cidade.trim().length >= 3;
            }
            
            if (!cidade || !data) {
                alert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }
            
            if (!validarCidade(cidade)) {
                alert('Por favor, digite um nome de cidade válido (mínimo 3 letras)');
                return;
            }

            // Envio AJAX para o Flask
            fetch('http://localhost:5000/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `cidade=${encodeURIComponent(cidade)}&nivel_agua=${encodeURIComponent(nivelAgua)}&pessoas_afetadas=${encodeURIComponent(pessoasAfetadas)}&data_enchente=${encodeURIComponent(data)}`
            })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem);
                form.reset();
            })
            .catch(error => {
                alert('Erro ao enviar: ' + error);
            });
        });
    }
});


