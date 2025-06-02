document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.__cadastro-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome_local = document.getElementById('nome_local').value;
            const nivelAgua = document.getElementById('nivel-agua').value;
            const pessoasAfetadas = document.getElementById('pessoas-afetadas').value;
            const data = document.getElementById('data').value;
            
            function validar_nome_local(nome_local) {
                const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/;
                return regex.test(nome_local) && nome_local.trim().length >= 3 && nome_local.trim().length <= 30;
            }
                        
            if (!nome_local || !data) {
                alert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }
            
            if (!validar_nome_local(nome_local)) {
                alert('Por favor, digite um nome de local válido (mínimo 3 letras, máximo 30)');
                return;
            }

            // Envio AJAX para o Flask
            fetch('http://localhost:5000/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `nome_local=${encodeURIComponent(nome_local)}&nivel_agua=${encodeURIComponent(nivelAgua)}&pessoas_afetadas=${encodeURIComponent(pessoasAfetadas)}&data_enchente=${encodeURIComponent(data)}`

            })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem || data.erro);
                form.reset();
            })
            .catch(error => {
                alert('Erro ao enviar: ' + error);
            });
        });
    }
});