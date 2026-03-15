{

    let activeCategoryId = null; 

    window.fetchCategories = async function() {
        const tbody = document.getElementById('categories-table-body');
        if (!tbody) return;

        try {
            console.log("Fetching categories...");
            const snapshot = await db.collection('categories').get();
            tbody.innerHTML = '';

            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">No categories found.</td></tr>';
                return;
            }

            snapshot.forEach(doc => {
                const cat = doc.data();
                const docId = doc.id;

                tbody.innerHTML += `
                    <tr>
                        <td>${cat.categoryId || docId}</td>
                        <td>${cat.name}</td>
                        <td>
                            <img src="${cat.imageUrl}" alt="${cat.name}" class="rounded border" style="width: 40px; height: 40px; object-fit: cover;">
                        </td>
                      <td>
                          <button class="btn btn-sm btn-warning me-1" onclick="openEditCategoryModal('${docId}', '${cat.name}')">
                              <i class="bi bi-pencil-square"></i>
                          </button>

                          <button class="btn btn-sm btn-danger" onclick="openDeleteCategoryModal('${docId}', '${cat.name}')">
                              <i class="bi bi-trash"></i>
                          </button>
                      </td>
                    </tr>`;
            });
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    window.uploadToImgBB = async function(file) {
        const API_KEY = "a3c8d35257779a06bdc4b306d992a25a";
        const formData = new FormData();
        formData.append("key", API_KEY);
        formData.append("image", file);

        const response = await fetch("https://api.imgbb.com/1/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (result.success) return result.data.url;
        else throw new Error("ImgBB Upload Failed");
    };

    window.saveCategoryModal = async function() {
        const name = document.getElementById('modal-category-name').value.trim();
        const iconInput = document.getElementById('modal-category-icon');
        const saveBtn = document.querySelector('button[onclick="saveCategoryModal()"]');

        if (!name) return alert("Please enter a name");

        try {
            saveBtn.disabled = true;
            saveBtn.innerText = "Saving...";

            if (activeCategoryId) {
                let updateData = { name: name };
                if (iconInput.files.length > 0) {
                    const url = await uploadToImgBB(iconInput.files[0]);
                    updateData.imageUrl = url;
                }
                await db.collection('categories').doc(activeCategoryId).update(updateData);
            } else {
                if (iconInput.files.length === 0) return alert("Please select an icon");
                const url = await uploadToImgBB(iconInput.files[0]);
                const newDocRef = db.collection('categories').doc();
                await newDocRef.set({
                    categoryId: newDocRef.id,
                    name: name,
                    imageUrl: url,
                    isSelected: false
                });
            }

            const modalEl = document.getElementById('categoryModal');
            bootstrap.Modal.getInstance(modalEl).hide();
            fetchCategories();
            Swal.fire('Success', 'Category saved', 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Something went wrong', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerText = "Save Category";
        }
    };

    window.openAddCategoryModal = function() {
        activeCategoryId = null;
        document.getElementById('categoryModalTitle').innerText = "Add Category";
        document.getElementById('modal-category-name').value = "";
        document.getElementById('modal-category-icon').value = "";
        new bootstrap.Modal(document.getElementById('categoryModal')).show();
    };

    window.openEditCategoryModal = function(id, name) {
        activeCategoryId = id;
        document.getElementById('categoryModalTitle').innerText = "Edit Category";
        document.getElementById('modal-category-name').value = name;
        document.getElementById('modal-category-icon').value = "";
        new bootstrap.Modal(document.getElementById('categoryModal')).show();
    };

    window.openDeleteCategoryModal = function(id, name) {
        activeCategoryId = id;
        Swal.fire({
            title: 'Delete Category?',
            text: `Are you sure you want to delete "${name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete'
        }).then((result) => {
            if (result.isConfirmed) {
                db.collection('categories').doc(id).delete().then(() => {
                    fetchCategories();
                    Swal.fire('Deleted', 'Category removed', 'success');
                });
            }
        });
    };

    window.initializeCategoriesModule = function() {
        console.log("Categories Module Initializing...");
        fetchCategories();
    };

}