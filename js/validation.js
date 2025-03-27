/*
 * Script para validação dos formulários de cadastro e agendamento
*/

document.addEventListener('DOMContentLoaded', function() {
    // Aplicar máscaras aos campos
    $('#cpf').mask('000.000.000-00', {reverse: true});
    $('#telefone').mask('(00) 00000-0000');

    // Validação do formulário de cadastro
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(event) {
            event.preventDefault();

            if (!validarFormulario(formCadastro)) {
                return false;
            }

            // Se o formulário for válido
            const nome = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const email = document.getElementById('email').value;

            // Validações específicas
            if (!validarEmail(email)) {
                mostrarErro('email', 'E-mail inválido. Por favor, digite um e-mail válido.');
                return false;
            }

            if (!validarCPF(cpf)) {
                mostrarErro('cpf', 'CPF inválido. Por favor, digite um CPF válido.');
                return false;
            }

            // Simulação de envio bem-sucedido
            mostrarNotificacao('Cadastro Realizado', `${nome}, seu cadastro foi realizado com sucesso!`, 'success');
            formCadastro.reset();
            limparValidacao(formCadastro);
        });
    }

    // Validação do formulário de agendamento
    const formAgendamento = document.getElementById('form-agendamento');
    if (formAgendamento) {
        // Mostrar/esconder campo de endereço de entrega com base no tipo de serviço
        const radioRetirada = document.getElementById('retirada');
        const radioEntrega = document.getElementById('entrega');
        const infoEntrega = document.getElementById('info-entrega');
        const enderecoEntrega = document.getElementById('endereco-entrega');

        if (radioRetirada && radioEntrega) {
            radioRetirada.addEventListener('change', function() {
                if (this.checked) {
                    infoEntrega.classList.add('d-none');
                    enderecoEntrega.required = false;
                }
            });

            radioEntrega.addEventListener('change', function() {
                if (this.checked) {
                    infoEntrega.classList.remove('d-none');
                    enderecoEntrega.required = true;
                }
            });
        }

        // Usar mesmo endereço do cadastro
        const mesmoEndereco = document.getElementById('mesmo-endereco');
        if (mesmoEndereco) {
            mesmoEndereco.addEventListener('change', function() {
                if (this.checked && document.getElementById('endereco')) {
                    enderecoEntrega.value = document.getElementById('endereco').value;
                    enderecoEntrega.disabled = true;
                } else {
                    enderecoEntrega.value = '';
                    enderecoEntrega.disabled = false;
                }
            });
        }

        // Validar data de agendamento (apenas dias úteis e data futura)
        const inputData = document.getElementById('data');
        if (inputData) {
            // Define data mínima como hoje
            const hoje = new Date();
            hoje.setDate(hoje.getDate() + 1);
            const dataMinima = hoje.toISOString().split('T')[0];
            inputData.min = dataMinima;

            inputData.addEventListener('change', function() {
                const [ano, mes, dia] = this.value.split('-').map(Number);
                const dataEscolhida = new Date(ano, mes - 1, dia);
                const diaSemana = dataEscolhida.getDay();

                // Verificar se é domingo (0)
                if (diaSemana === 0) {
                    mostrarErro('data', 'Não realizamos agendamentos aos domingos. Por favor, escolha outra data.');
                    this.value = '';
                    document.getElementById('horario').innerHTML = '<option value="" selected disabled>Selecione um horário</option>';
                } else {
                    this.setCustomValidity('');
                    // Gerar horários disponíveis
                    gerarHorariosDisponiveis(diaSemana);
                }
            });
        }

        // Submit do formulário de agendamento
        formAgendamento.addEventListener('submit', function(event) {
            event.preventDefault();

            if (!validarFormulario(formAgendamento)) {
                return false;
            }

            // Se o formulário for válido
            const data = document.getElementById('data').value;
            const horario = document.getElementById('horario').value;
            const tipoServico = document.querySelector('input[name="tipoServico"]:checked').value;

            // Formatar data para exibição
            const dataFormatada = new Date(data);
            dataFormatada.setDate(dataFormatada.getDate() + 1);
            const dataFormatadaString = dataFormatada.toLocaleDateString('pt-BR');

            let mensagem = `Seu agendamento para ${tipoServico === 'retirada' ? 'retirada' : 'entrega'} foi confirmado para o dia ${dataFormatadaString} às ${horario}h.`;

            // Simulação de envio bem-sucedido
            mostrarNotificacao('Agendamento Confirmado', mensagem, 'success');
            formAgendamento.reset();
            limparValidacao(formAgendamento);

            // Atualizar o calendário
            atualizarCalendario();
        });
    }

    // Inicializar o calendário
    atualizarCalendario();
});

/**
 * Função para validar formulário completo
 * @param {HTMLFormElement} formulario - O formulário a ser validado
 * @returns {boolean} Verdadeiro se o formulário for válido
 */
function validarFormulario(formulario) {
    if (!formulario.checkValidity()) {
        event.stopPropagation();
        formulario.classList.add('was-validated');
        return false;
    }
    return true;
}

/**
 * Função para mostrar mensagem de erro em um campo
 * @param {string} campoId - O ID do campo com erro
 * @param {string} mensagem - A mensagem de erro a ser exibida
 */
function mostrarErro(campoId, mensagem) {
    const campo = document.getElementById(campoId);
    campo.setCustomValidity(mensagem);
    campo.parentElement.querySelector('.invalid-feedback').textContent = mensagem;
    campo.classList.add('is-invalid');
}

/**
 * Função para limpar validações de um formulário
 * @param {HTMLFormElement} formulario - O formulário a ser limpo
 */
function limparValidacao(formulario) {
    formulario.classList.remove('was-validated');
    const campos = formulario.querySelectorAll('.is-invalid');
    campos.forEach(campo => {
        campo.classList.remove('is-invalid');
        campo.setCustomValidity('');
    });
}

/**
 * Função para validar e-mail
 * @param {string} email - O e-mail a ser validado
 * @returns {boolean} Verdadeiro se o e-mail for válido
 */
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Função para validar CPF
 * @param {string} cpf - O CPF a ser validado
 * @returns {boolean} Verdadeiro se o CPF for válido
 */
function validarCPF(cpf) {
    // Remover caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verificar se tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }

    // Verificar se todos os dígitos são iguais (CPF inválido, mas com regra correta)
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    // Validar dígitos verificadores
    let soma = 0;
    let resto;

    // Primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    // Segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}

/**
 * Função para gerar horários disponíveis com base no dia da semana
 * @param {number} diaSemana - O dia da semana (0-6, sendo 0 = Domingo)
 */
function gerarHorariosDisponiveis(diaSemana) {
    const selectHorario = document.getElementById('horario');
    selectHorario.innerHTML = '<option value="" selected disabled>Selecione um horário</option>';

    // Definir horários disponíveis
    let horaInicio, horaFim;

    if (diaSemana === 0) { // Domingo
        horaInicio = 8;
        horaFim = 12;
    } else { // Segunda a Sábado
        horaInicio = 8;
        horaFim = 20;
    }

    // Adicionar opções de horários a cada 30 minutos
    for (let hora = horaInicio; hora < horaFim; hora++) {
        // Horários cheios (9:00, 10:00, etc)
        const optionHoraCheia = document.createElement('option');
        optionHoraCheia.value = `${hora}:00`;
        optionHoraCheia.textContent = `${hora}:00`;
        selectHorario.appendChild(optionHoraCheia);

        // Horários e meia (9:30, 10:30, etc)
        const optionHoraMeia = document.createElement('option');
        optionHoraMeia.value = `${hora}:30`;
        optionHoraMeia.textContent = `${hora}:30`;
        selectHorario.appendChild(optionHoraMeia);
    }
}

/**
 * Função para atualizar o calendário de agendamentos
 */
function atualizarCalendario() {
    const containerCalendario = document.getElementById('calendario-agendamento');
    if (!containerCalendario) return;

    const dataAtual = new Date();
    const mes = dataAtual.getMonth();
    const ano = dataAtual.getFullYear();

    // Criar tabela para o calendário
    let html = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th colspan="7">${obterNomeMes(mes)} ${ano}</th>
                </tr>
                <tr>
                    <th>Dom</th>
                    <th>Seg</th>
                    <th>Ter</th>
                    <th>Qua</th>
                    <th>Qui</th>
                    <th>Sex</th>
                    <th>Sáb</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Obter o primeiro dia do mês
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    // Iniciar com células vazias para os dias anteriores ao primeiro dia do mês
    let diaInicial = primeiroDia.getDay();
    html += '<tr>';

    for (let i = 0; i < diaInicial; i++) {
        html += '<td></td>';
    }

    // Preencher os dias do mês
    let diaAtual = 1;
    const hoje = dataAtual.getDate();

    while (diaAtual <= ultimoDia.getDate()) {
        // Se chegarmos ao Domingo (0), iniciamos uma nova linha
        if (primeiroDia.getDay() === 0 && diaAtual > 1) {
            html += '</tr><tr>';
        }

        // Determinar a classe para o dia (hoje, passado, disponível, indisponível)
        let classe = '';
        let disponivel = true;

        // Dias no passado não são disponíveis
        if (diaAtual < hoje) {
            classe = 'indisponivel';
            disponivel = false;
        }
        // Domingos não são disponíveis
        else if (primeiroDia.getDay() === 0) {
            classe = 'indisponivel';
            disponivel = false;
        }
        // Dia atual é destacado
        else if (diaAtual === hoje) {
            classe = 'bg-warning';
        }
        // Futuro disponível
        else {
            classe = 'disponivel';
        }

        html += `<td class="${classe}" data-date="${ano}-${(mes+1).toString().padStart(2, '0')}-${diaAtual.toString().padStart(2, '0')}">${diaAtual}</td>`;

        diaAtual++;
        primeiroDia.setDate(primeiroDia.getDate() + 1);
    }

    // Completar a última linha com células vazias
    while (primeiroDia.getDay() !== 0) {
        html += '<td></td>';
        primeiroDia.setDate(primeiroDia.getDate() + 1);
    }

    html += '</tr></tbody></table>';
    containerCalendario.innerHTML = html;

    // Adicionar listeners para os dias disponíveis
    const diasDisponiveis = containerCalendario.querySelectorAll('td.disponivel');
    diasDisponiveis.forEach(dia => {
        dia.addEventListener('click', function() {
            const dataClicada = this.getAttribute('data-date');
            document.getElementById('data').value = dataClicada;

            // Disparar o evento change para gerar os horários
            const event = new Event('change');
            document.getElementById('data').dispatchEvent(event);

            // Destaque visual
            containerCalendario.querySelectorAll('td.selecionado').forEach(td => {
                td.classList.remove('selecionado');
            });
            this.classList.add('selecionado');
        });
    });
}

/**
 * Função para obter o nome do mês em português
 * @param {number} mes - O número do mês (0-11)
 * @returns {string} O nome do mês
 */
function obterNomeMes(mes) {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[mes];
}
