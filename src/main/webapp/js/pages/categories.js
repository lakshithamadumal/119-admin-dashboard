/**
 * Categories page module.
 * Depends on: js/utils.js, js/data.js
 */

function renderCategoriesTable(targetId, data) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = data.map(category => {
    const reportCount = reportsData.filter(r => r.categoryId === category.id).length;

    return `
      <tr>
        <td>${category.id}</td>
        <td>${category.name}</td>
        <td>
          <img
            src="${category.icon || createCategoryIconPlaceholder(category.name, '#64748b')}"
            alt="${category.name} icon"
            class="rounded border"
            style="width: 40px; height: 40px; object-fit: cover;"
          >
        </td>
        <td><span class="badge bg-label-info">${reportCount}</span></td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="openEditCategoryModal(${category.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="openDeleteCategoryModal(${category.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function initializeCategoriesModule() {
  const iconInput = document.getElementById('modal-category-icon');
  if (!iconInput || iconInput.dataset.bound === 'true') {
    return;
  }

  iconInput.addEventListener('change', handleCategoryIconUpload);
  iconInput.dataset.bound = 'true';
}

function handleCategoryIconUpload(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('Please upload a valid image file.');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    activeCategoryIcon = typeof reader.result === 'string' ? reader.result : '';
    updateCategoryIconPreview(activeCategoryIcon);
  };
  reader.readAsDataURL(file);
}

function updateCategoryIconPreview(iconValue) {
  const previewWrap = document.getElementById('modal-category-icon-preview-wrap');
  const previewImage = document.getElementById('modal-category-icon-preview');
  if (!previewWrap || !previewImage) {
    return;
  }

  if (iconValue) {
    previewImage.src = iconValue;
    previewWrap.classList.remove('d-none');
  } else {
    previewImage.src = '';
    previewWrap.classList.add('d-none');
  }
}

function openAddCategoryModal() {
  activeCategoryId = null;
  activeCategoryIcon = '';
  document.getElementById('categoryModalTitle').textContent = 'Add Category';
  document.getElementById('modal-category-name').value = '';
  document.getElementById('modal-category-icon').value = '';
  updateCategoryIconPreview('');

  const modalElement = document.getElementById('categoryModal');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
}

function openEditCategoryModal(categoryId) {
  const category = categoriesData.find(item => item.id === categoryId);
  if (!category) {
    return;
  }

  activeCategoryId = categoryId;
  activeCategoryIcon = category.icon || '';
  document.getElementById('categoryModalTitle').textContent = 'Edit Category';
  document.getElementById('modal-category-name').value = category.name;
  document.getElementById('modal-category-icon').value = '';
  updateCategoryIconPreview(activeCategoryIcon);

  const modalElement = document.getElementById('categoryModal');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
}

function saveCategoryModal() {
  const name = document.getElementById('modal-category-name').value.trim();
  const icon = activeCategoryIcon;

  if (!name) {
    alert('Please enter a category name');
    return;
  }

  if (!icon) {
    alert('Please upload a category icon');
    return;
  }

  if (activeCategoryId) {
    const category = categoriesData.find(item => item.id === activeCategoryId);
    if (category) {
      category.name = name;
      category.icon = icon;
    }
  } else {
    const newId = categoriesData.length
      ? Math.max(...categoriesData.map(item => item.id)) + 1
      : 1;
    const today = new Date().toISOString().split('T')[0];

    categoriesData.push({
      id: newId,
      name: name,
      icon: icon,
      status: 'Active',
      createdDate: today
    });
  }

  renderCategoriesTable('categories-table-body', categoriesData);

  const modalElement = document.getElementById('categoryModal');
  if (modalElement) {
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}

function openDeleteCategoryModal(categoryId) {
  const category = categoriesData.find(item => item.id === categoryId);
  if (!category) {
    return;
  }

  activeCategoryId = categoryId;
  document.getElementById('delete-confirm-message').textContent = `Are you sure you want to delete the "${category.name}" category?`;

  const modalElement = document.getElementById('deleteConfirmModal');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
}

function confirmDeleteCategory() {
  if (!activeCategoryId) {
    return;
  }

  const categoryIndex = categoriesData.findIndex(item => item.id === activeCategoryId);
  if (categoryIndex !== -1) {
    categoriesData.splice(categoryIndex, 1);
  }

  renderCategoriesTable('categories-table-body', categoriesData);

  const modalElement = document.getElementById('deleteConfirmModal');
  if (modalElement) {
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  activeCategoryId = null;
}
