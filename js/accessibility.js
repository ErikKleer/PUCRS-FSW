/**
 * Implementa recursos de acessibilidade para o site MiniMerch
 * Última atualização: Março de 2025
*/

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funcionalidades de acessibilidade
    initAccessibilityFeatures();
});

/**
 * Inicializa todas as funcionalidades de acessibilidade
 */
function initAccessibilityFeatures() {
    // Controle de tamanho da fonte
    initFontSizeControl();

    // Modo de alto contraste
    initHighContrastMode();

    // Melhorias para navegação por teclado
    enhanceKeyboardNavigation();

    // Garantir que todos os elementos interativos sejam acessíveis
    enhanceInteractiveElements();
}

/**
 * Inicializa controles para aumentar e diminuir o tamanho da fonte
 */
function initFontSizeControl() {
    const btnAumentarFonte = document.getElementById('btn-aumentar-fonte');
    const btnDiminuirFonte = document.getElementById('btn-diminuir-fonte');

    // Obter tamanho atual da fonte (ou definir como normal se não existir)
    let currentFontSize = localStorage.getItem('fontSizePreference') || 'normal';

    // Aplicar tamanho de fonte salvo anteriormente
    applyFontSize(currentFontSize);

    // Evento para aumentar fonte
    if (btnAumentarFonte) {
        btnAumentarFonte.addEventListener('click', function() {
            // Alterar tamanho da fonte com base no valor atual
            switch (currentFontSize) {
                case 'pequena':
                    currentFontSize = 'normal';
                    showAccessibilityNotification('Tamanho da fonte aumentado');
                    break;
                case 'normal':
                    currentFontSize = 'grande';
                    showAccessibilityNotification('Tamanho da fonte aumentado');
                    break;
                case 'grande':
                    currentFontSize = 'muito-grande';
                    showAccessibilityNotification('Tamanho da fonte aumentado');
                    break;
                case 'muito-grande':
                    showAccessibilityNotification('Este é o maior tamanho de fonte disponível');
                    break;
                default:
                    currentFontSize = 'normal';
            }

            // Aplicar e salvar a preferência
            applyFontSize(currentFontSize);
            localStorage.setItem('fontSizePreference', currentFontSize);
        });
    }

    // Evento para diminuir fonte
    if (btnDiminuirFonte) {
        btnDiminuirFonte.addEventListener('click', function() {
            // Alterar tamanho da fonte com base no valor atual
            switch (currentFontSize) {
                case 'muito-grande':
                    currentFontSize = 'grande';
                    showAccessibilityNotification('Tamanho da fonte diminuído');
                    break;
                case 'grande':
                    currentFontSize = 'normal';
                    showAccessibilityNotification('Tamanho da fonte diminuído');
                    break;
                case 'normal':
                    currentFontSize = 'pequena';
                    showAccessibilityNotification('Tamanho da fonte diminuído');
                    break;
                case 'pequena':
                    showAccessibilityNotification('Este é o menor tamanho de fonte disponível');
                    break;
                default:
                    currentFontSize = 'normal';
            }

            // Aplicar e salvar a preferência
            applyFontSize(currentFontSize);
            localStorage.setItem('fontSizePreference', currentFontSize);
        });
    }
}

/**
 * Aplica o tamanho de fonte especificado ao documento
 * @param {string} size - Tamanho de fonte a ser aplicado (pequena, normal, grande, muito-grande)
 */
function applyFontSize(size) {
    // Remover todas as classes de tamanho de fonte
    document.body.classList.remove('fonte-pequena', 'fonte-normal', 'fonte-grande', 'fonte-muito-grande');

    // Adicionar a classe apropriada
    document.body.classList.add(`fonte-${size}`);
}

/**
 * Inicializa o modo de alto contraste
 */
function initHighContrastMode() {
    const btnContraste = document.getElementById('btn-contraste');

    // Verificar se o modo de alto contraste estava ativado
    const contrastMode = localStorage.getItem('highContrastMode') === 'true';

    // Aplicar configuração salva
    if (contrastMode) {
        document.body.classList.add('alto-contraste');
    }

    // Alternar modo de alto contraste quando o botão for clicado
    if (btnContraste) {
        btnContraste.addEventListener('click', function() {
            // Alternar classe de alto contraste
            document.body.classList.toggle('alto-contraste');

            // Verificar se o modo está ativado
            const isHighContrast = document.body.classList.contains('alto-contraste');

            // Salvar preferência
            localStorage.setItem('highContrastMode', isHighContrast);

            // Feedback para o usuário
            showAccessibilityNotification(isHighContrast ?
                'Modo de alto contraste ativado' :
                'Modo de alto contraste desativado');
        });
    }
}

/**
 * Melhora a navegação por teclado em toda a página
 */
function enhanceKeyboardNavigation() {
    // Adicionar atributo tabindex para elementos que precisam ser focáveis
    const elementsToFocus = document.querySelectorAll('.produto-card, .servico');
    elementsToFocus.forEach((element, index) => {
        element.setAttribute('tabindex', '0');
    });

    // Adicionar atalhos de teclado para seções principais
    document.addEventListener('keydown', function(event) {
        // Alt + 1-7 para navegação rápida entre seções
        if (event.altKey && event.key >= '1' && event.key <= '7') {
            event.preventDefault();

            const sectionIndex = parseInt(event.key) - 1;
            const sections = [
                '#carousel-section', // 1
                '#verde',           // 2
                '#marrom',          // 3
                '#branco',          // 4
                '#servicos',        // 5
                '#cadastro',        // 6
                '#agendamento'      // 7
            ];

            if (sections[sectionIndex]) {
                const sectionElement = document.querySelector(sections[sectionIndex]);
                if (sectionElement) {
                    sectionElement.scrollIntoView({ behavior: 'smooth' });
                    sectionElement.focus();
                }
            }
        }

        // Esc para fechar notificações
        if (event.key === 'Escape') {
            const toastElements = document.querySelectorAll('.toast.show');
            toastElements.forEach(toast => {
                const toastInstance = bootstrap.Toast.getInstance(toast);
                if (toastInstance) {
                    toastInstance.hide();
                }
            });
        }
    });

    // Instruções de navegação para leitores de tela
    const accessibilityInfo = document.createElement('div');
    accessibilityInfo.className = 'visually-hidden';
    accessibilityInfo.setAttribute('role', 'note');
    accessibilityInfo.setAttribute('aria-live', 'polite');
    accessibilityInfo.textContent = 'Use Alt + números de 1 a 7 para navegar entre as seções principais do site. Alt+1: Início, Alt+2: Frutas e Verduras, Alt+3: Produtos Não Perecíveis, Alt+4: Higiene e Limpeza, Alt+5: Serviços, Alt+6: Cadastro, Alt+7: Agendamento.';
    document.body.appendChild(accessibilityInfo);
}

/**
 * Melhora elementos interativos para acessibilidade
 */
function enhanceInteractiveElements() {
    // Garantir que todos os botões tenham propriedades aria adequadas
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });

    // Garantir que imagens tenham alternativas adequadas
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.getAttribute('alt')) {
            // Se não tiver alt, usar o texto próximo como alternativa ou marcar como decorativa
            const nearbyHeading = img.closest('article')?.querySelector('h3');
            if (nearbyHeading) {
                img.setAttribute('alt', `Imagem de ${nearbyHeading.textContent}`);
            } else {
                img.setAttribute('alt', '');
                img.setAttribute('role', 'presentation');
            }
        }
    });

    // Adicionar legendas para formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.setAttribute('aria-describedby', `${form.id}-desc`);

        const formDescription = document.createElement('div');
        formDescription.id = `${form.id}-desc`;
        formDescription.className = 'sr-only';

        if (form.id === 'form-cadastro') {
            formDescription.textContent = 'Formulário de cadastro. Campos marcados com asterisco são obrigatórios.';
        } else if (form.id === 'form-agendamento') {
            formDescription.textContent = 'Formulário de agendamento de serviço. Selecione o tipo de serviço, data e horário desejados.';
        }

        form.parentNode.insertBefore(formDescription, form);
    });
}

/**
 * Exibe uma notificação relacionada à acessibilidade
 * @param {string} message - Mensagem a ser exibida
 */
function showAccessibilityNotification(message) {
    const toast = new bootstrap.Toast(document.getElementById('notificacaoToast'));

    document.getElementById('toast-titulo').textContent = 'Acessibilidade';
    document.getElementById('toast-mensagem').textContent = message;

    toast.show();

    // Também anuncia para leitores de tela
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remover após anúncio
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 3000);
}
